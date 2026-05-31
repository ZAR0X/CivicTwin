import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MOCK_REPORTS, BHOPAL_COORDINATES } from '../data/mockReports';

export function MapViewer() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [_, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    try {
      // Sanitize properties to remove arrays (like coordinates) which can cause MapLibre warnings
      const geojsonData: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: MOCK_REPORTS.map((r) => {
          const { coordinates, ...safeProps } = r;
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: r.coordinates as [number, number],
            },
            properties: safeProps,
          };
        }),
      };

      // Use a completely stable public vector style as base to prevent style-load failures
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        center: [BHOPAL_COORDINATES.longitude, BHOPAL_COORDINATES.latitude],
        zoom: 12.8,
        pitch: 45,
        bearing: -15,
        dragRotate: true,
        maxZoom: 18,
        minZoom: 10,
      });

      mapRef.current = map;

      map.on('error', (e) => {
        console.error('MapLibre Error:', e.error);
        setError(`Map Error: ${e.error?.message || 'Unknown error'}`);
      });

      map.on('load', () => {
        // Force resize
        map.resize();

        // Add Satellite Layer
        if (!map.getSource('satellite')) {
          map.addSource('satellite', {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256
          });
        }
        if (!map.getLayer('satellite-layer')) {
          // Add satellite layer
          map.addLayer({
            id: 'satellite-layer',
            type: 'raster',
            source: 'satellite',
            minzoom: 0,
            maxzoom: 22,
            layout: { visibility: 'visible' }
          }); 
        }

        // Add Heatmap Source
        if (!map.getSource('reports')) {
          map.addSource('reports', {
            type: 'geojson',
            data: geojsonData,
          });
        }

        if (!map.getLayer('reports-heatmap')) {
          map.addLayer({
            id: 'reports-heatmap',
            type: 'heatmap',
            source: 'reports',
            maxzoom: 14.5,
            paint: {
              'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'severity'],
                1, 0.2,
                10, 1.5,
              ],
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10, 1,
                14.5, 3,
              ],
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(0, 0, 255, 0)',
                0.2, 'rgba(146, 229, 236, 0.5)',
                0.4, 'rgba(56, 189, 248, 0.7)',
                0.6, 'rgba(234, 179, 8, 0.85)',
                0.8, 'rgba(249, 115, 22, 0.95)',
                1, 'rgba(255, 111, 0, 1)',
              ],
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10, 12,
                14.5, 28,
              ],
              'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                13.5, 1.0,
                14.5, 0.0,
              ],
            },
          });
        }

        const renderMarkers = () => {
          const zoom = map.getZoom();
          if (zoom < 13.5) return;

          const existingMarkers = document.querySelectorAll('.custom-marker-container');
          if (existingMarkers.length > 0) return;

          geojsonData.features.forEach((feature) => {
            const props = feature.properties as any;
            const coords = (feature.geometry as any).coordinates;

            const el = document.createElement('div');
            el.className = 'custom-marker-container absolute cursor-pointer';
            el.style.width = '36px';
            el.style.height = '36px';
            
            const innerEl = document.createElement('div');
            innerEl.style.width = '100%';
            innerEl.style.height = '100%';
            innerEl.style.borderRadius = '50%';
            innerEl.style.backgroundImage = `url(${props.image})`;
            innerEl.style.backgroundSize = 'cover';
            innerEl.style.border = props.severity >= 8 ? '2px solid #fca5a5' : props.severity >= 5 ? '2px solid #fdbb2d' : '2px solid #fef08a';
            innerEl.style.boxShadow = '0 0 12px rgba(0,0,0,0.5)';
            innerEl.style.transition = 'transform 0.2s';
            
            innerEl.onmouseover = () => innerEl.style.transform = 'scale(1.2)';
            innerEl.onmouseout = () => innerEl.style.transform = 'scale(1)';

            el.appendChild(innerEl);

            if (zoom >= 14) {
              const label = document.createElement('div');
              label.innerText = `${props.category} (Lvl ${props.severity})`;
              label.style.position = 'absolute';
              label.style.bottom = '-24px';
              label.style.left = '50%';
              label.style.transform = 'translateX(-50%)';
              label.style.backgroundColor = 'rgba(255,255,255,0.95)';
              label.style.color = '#0f172a';
              label.style.padding = '2px 8px';
              label.style.borderRadius = '4px';
              label.style.fontSize = '11px';
              label.style.fontWeight = 'bold';
              label.style.whiteSpace = 'nowrap';
              label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
              el.appendChild(label);
            }

            new maplibregl.Marker({ element: el })
              .setLngLat(coords as [number, number])
              .addTo(map);
          });
        };

        map.on('zoom', renderMarkers);
      });
    } catch (e: any) {
      console.error('Failed to initialize map:', e);
      setError(`Failed to initialize: ${e.message}`);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ height: '600px', minHeight: '600px' }} className="w-full relative rounded-2xl overflow-hidden bg-slate-800">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
