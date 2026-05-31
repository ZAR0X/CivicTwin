import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
const BHOPAL_COORDINATES = { latitude: 23.2599, longitude: 77.4126 };
import type { Ticket } from '../lib/supabase';

interface MapViewerProps {
  selectedTicketId?: string | null;
  onSelectTicket?: (id: string | null) => void;
  tickets?: Ticket[];
}

export function MapViewer({ selectedTicketId, onSelectTicket, tickets = [] }: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [_, setError] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (mapRef.current || !mapContainer.current || tickets.length === 0) return;

    try {
      const geojsonData: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: tickets.map((r) => {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [r.lng, r.lat],
            },
            properties: r,
          };
        }),
      };

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        center: [BHOPAL_COORDINATES.longitude, BHOPAL_COORDINATES.latitude],
        zoom: 12.8,
        pitch: 45,
        bearing: -15,
        dragRotate: true,
        scrollZoom: true, // Explicitly enable gestures
        dragPan: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
        maxZoom: 18,
        minZoom: 10,
      });

      mapRef.current = map;

      map.on('error', (e) => {
        console.error('MapLibre Error:', e.error);
        setError(`Map Error: ${e.error?.message || 'Unknown error'}`);
      });

      map.on('load', () => {
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
              'heatmap-weight': ['interpolate', ['linear'], ['get', 'severity'], 1, 0.2, 10, 1.5],
              'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 10, 1, 14.5, 3],
              'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(0, 0, 255, 0)',
                0.2, 'rgba(146, 229, 236, 0.5)',
                0.4, 'rgba(56, 189, 248, 0.7)',
                0.6, 'rgba(234, 179, 8, 0.85)',
                0.8, 'rgba(249, 115, 22, 0.95)',
                1, 'rgba(255, 111, 0, 1)',
              ],
              'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 12, 14.5, 28],
              'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 13.5, 1.0, 14.5, 0.0],
            },
          });
        }

        // Render Markers manually so we can attach click events
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

            // Click listener
            el.addEventListener('click', (e) => {
              e.stopPropagation();
              if (onSelectTicket) onSelectTicket(props.id);
            });

            new maplibregl.Marker({ element: el })
              .setLngLat(coords as [number, number])
              .addTo(map);
          });
        };

        map.on('zoom', renderMarkers);

        // Map click to deselect
        map.on('click', () => {
          if (onSelectTicket) onSelectTicket(null);
        });
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
  }, []); // Run only once

  // Handle selected ticket changes (flyTo and Popup)
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Clean up existing popup
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    if (!selectedTicketId) return;

    const ticket = tickets.find(t => t.id === selectedTicketId);
    if (!ticket) return;

    // Fly to location
    map.flyTo({
      center: [ticket.lng, ticket.lat],
      zoom: 16, // Zoom in
      pitch: 60,
      duration: 1500,
      essential: true
    });

    // We must wait for styles to be ready and map to finish moving, 
    // or just attach popup immediately. MapLibre popups stick during flyTo.
    const popupContent = document.createElement('div');
    popupContent.className = 'w-64 glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col pointer-events-auto border border-white/20 dark:border-white/10';
    popupContent.style.background = 'rgba(var(--glass-bg-rgb, 255, 255, 255), 0.85)';
    popupContent.style.backdropFilter = 'blur(24px)';
    
    popupContent.innerHTML = `
      <div class="h-24 w-full bg-cover bg-center" style="background-image: url('${ticket.image}')"></div>
      <div class="p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-[var(--text-adaptive-dim)]">${ticket.category}</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full font-bold ${ticket.severity >= 8 ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-orange-500/20 text-orange-600 dark:text-orange-400'}">Lvl ${ticket.severity}</span>
        </div>
        <p class="text-sm font-medium text-[var(--text-adaptive)] line-clamp-2 leading-snug">${ticket.description}</p>
        <div class="flex gap-2 mt-2">
          <button id="btn-assign-${ticket.id}" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 rounded-lg transition-colors">Assign</button>
          <button id="btn-resolve-${ticket.id}" class="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-lg transition-colors">Resolve</button>
        </div>
      </div>
    `;

    // Attach button listeners
    const btnAssign = popupContent.querySelector(`#btn-assign-${ticket.id}`);
    const btnResolve = popupContent.querySelector(`#btn-resolve-${ticket.id}`);
    
    if (btnAssign) {
      btnAssign.addEventListener('click', (e) => {
        e.stopPropagation();
        alert(`Ticket ${ticket.id} assigned to field crew.`);
      });
    }
    if (btnResolve) {
      btnResolve.addEventListener('click', (e) => {
        e.stopPropagation();
        alert(`Ticket ${ticket.id} marked as resolved!`);
      });
    }

    // Create the Popup and anchor it bottom-left so it stays "close to the blip"
    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      anchor: 'bottom-left',
      offset: [15, -15], // Offset slightly from the marker center
      className: 'custom-ticket-popup'
    })
      .setDOMContent(popupContent)
      .setLngLat([ticket.lng, ticket.lat])
      .addTo(map);

    popupRef.current = popup;

  }, [selectedTicketId]);

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden bg-slate-900">
      {/* Required style to override MapLibre popup default backgrounds */}
      <style>{`
        .custom-ticket-popup .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          border-radius: 1rem;
        }
        .custom-ticket-popup .maplibregl-popup-tip {
          display: none; /* Hide the default little arrow pointing down */
        }
      `}</style>
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
