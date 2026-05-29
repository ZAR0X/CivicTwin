// Map HTML template using MapLibre GL JS and OpenFreeMap

export const BHOPAL_COORDINATES = {
  latitude: 23.2599,
  longitude: 77.4126,
};

// Generate 17 mock reports in Bhopal
export const MOCK_REPORTS = [
  // MP Nagar (Commercial Hub - High Density)
  {
    id: 'rep-1',
    coordinates: [77.4262, 23.2324],
    category: 'Roads',
    severity: 8,
    description: 'Massive pothole in the middle of Zone-II main street causing major traffic jams.',
    image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=500&auto=format&fit=crop',
    upvotes: 42,
    department: 'Municipal Corporation (PWD)',
    status: 'Pending',
    date: 'May 25, 2026',
    aiReview: 'AI Diagnostics: Severe pavement breach detected (approx 18cm depth). Immediate asphalt patching required to prevent vehicle damage.',
    address: 'Zone-II, MP Nagar, Bhopal',
  },
  {
    id: 'rep-2',
    coordinates: [77.4290, 23.2345],
    category: 'Sanitation',
    severity: 6,
    description: 'Overflowing dustbin and garbage dumped on the sidewalk near Jyoti Cineplex.',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop',
    upvotes: 19,
    department: 'Sanitation Dept',
    status: 'Assigned',
    date: 'May 26, 2026',
    aiReview: 'AI Diagnostics: Refuse overflow violates environmental sanitation protocols. High risk of pest infestation.',
    address: 'Near Jyoti Cineplex, Zone-I, MP Nagar, Bhopal',
  },
  {
    id: 'rep-3',
    coordinates: [77.4240, 23.2310],
    category: 'Utility',
    severity: 9,
    description: 'High-voltage electric wires dangling dangerously low near a public bus stop.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&auto=format&fit=crop',
    upvotes: 89,
    department: 'MPEB (Electricity Board)',
    status: 'In Progress',
    date: 'May 24, 2026',
    aiReview: 'AI Diagnostics: Critical electrical hazard. Exposed live conductors at public access level. Dispatching urgent repair crew.',
    address: 'Bus Stop, Zone-II, MP Nagar, Bhopal',
  },
  {
    id: 'rep-4',
    coordinates: [77.4275, 23.2355],
    category: 'Water',
    severity: 7,
    description: 'Drinking water pipeline leakage flooding the corner of DB Mall road.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&auto=format&fit=crop',
    upvotes: 35,
    department: 'Water Works Dept',
    status: 'Pending',
    date: 'May 26, 2026',
    aiReview: 'AI Diagnostics: Pressurized clean water leakage. Localized soil liquefaction hazard. Priority 2 repair recommended.',
    address: 'DB Mall Road, MP Nagar, Bhopal',
  },

  // TT Nagar & New Market
  {
    id: 'rep-5',
    coordinates: [77.3995, 23.2330],
    category: 'Roads',
    severity: 5,
    description: 'Uneven road tiles near New Market entrance causing senior citizens to trip.',
    image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=500&auto=format&fit=crop',
    upvotes: 12,
    department: 'Municipal Corporation (PWD)',
    status: 'Assigned',
    date: 'May 25, 2026',
    aiReview: 'AI Diagnostics: Minor structural misalignment in pedestrian walkway. Recommended leveling to restore compliance.',
    address: 'New Market Main Entrance, TT Nagar, Bhopal',
  },
  {
    id: 'rep-6',
    coordinates: [77.3970, 23.2305],
    category: 'Sanitation',
    severity: 7,
    description: 'Open sewer line emitting foul odor and breeding mosquitoes near Jawahar Chowk.',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop',
    upvotes: 54,
    department: 'Sanitation Dept',
    status: 'Pending',
    date: 'May 26, 2026',
    aiReview: 'AI Diagnostics: Biohazard risk due to open sewage venting. Recommended immediate containment and chemical treatment.',
    address: 'Jawahar Chowk, TT Nagar, Bhopal',
  },
  {
    id: 'rep-7',
    coordinates: [77.4010, 23.2350],
    category: 'Utility',
    severity: 4,
    description: 'Streetlights not working on the main New Market stretch for the last 3 nights.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&auto=format&fit=crop',
    upvotes: 8,
    department: 'MPEB (Electricity Board)',
    status: 'Pending',
    date: 'May 26, 2026',
    aiReview: 'AI Diagnostics: Illumination grid failure. Elevated risk for night pedestrian safety. Scheduled bulb replacement.',
    address: 'Main Shopping Stretch, New Market, Bhopal',
  },

  // Kolar Road (Residential Hub - Waterlogging/Road issues)
  {
    id: 'rep-8',
    coordinates: [77.4200, 23.1850],
    category: 'Roads',
    severity: 9,
    description: 'Severely damaged road surface on Kolar main road due to ongoing sewage pipe work.',
    image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=500&auto=format&fit=crop',
    upvotes: 110,
    department: 'Municipal Corporation (PWD)',
    status: 'In Progress',
    date: 'May 23, 2026',
    aiReview: 'AI Diagnostics: Severe arterial route degradation. Subsurface stability compromised. Coordination with sewage contractor requested.',
    address: 'Kolar Main Road, Bhopal',
  },
  {
    id: 'rep-9',
    coordinates: [77.4180, 23.1780],
    category: 'Water',
    severity: 8,
    description: 'Heavy waterlogging in residential colony entrance blocking car access.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&auto=format&fit=crop',
    upvotes: 76,
    department: 'Water Works Dept',
    status: 'Pending',
    date: 'May 25, 2026',
    aiReview: 'AI Diagnostics: Inadequate drainage throughput causing blockages. Requires immediate pump out and clearing.',
    address: 'Saket Nagar Entrance, Kolar Road, Bhopal',
  },
  {
    id: 'rep-10',
    coordinates: [77.4230, 23.1900],
    category: 'Sanitation',
    severity: 5,
    description: 'Garbage dump near public park corner not cleared in over a week.',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop',
    upvotes: 22,
    department: 'Sanitation Dept',
    status: 'Assigned',
    date: 'May 24, 2026',
    aiReview: 'AI Diagnostics: Accumulation of organic waste. Moderate risk of neighborhood rodent infestation.',
    address: 'Nehru Park Corner, Kolar Road, Bhopal',
  },

  // Arera Colony
  {
    id: 'rep-11',
    coordinates: [77.4350, 23.2100],
    category: 'Utility',
    severity: 6,
    description: 'Fallen tree branch dragging electrical cables down on E-7 road.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&auto=format&fit=crop',
    upvotes: 29,
    department: 'MPEB (Electricity Board)',
    status: 'Pending',
    date: 'May 26, 2026',
    aiReview: 'AI Diagnostics: Structural mechanical stress on electrical cables. Urgent pruning and tension restoration required.',
    address: 'E-7 Road, Sector 3, Arera Colony, Bhopal',
  },
  {
    id: 'rep-12',
    coordinates: [77.4420, 23.2150],
    category: 'Roads',
    severity: 4,
    description: 'Speed breaker not painted with reflective lines, causing dangerous sudden brakes.',
    image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=500&auto=format&fit=crop',
    upvotes: 15,
    department: 'Municipal Corporation (PWD)',
    status: 'Resolved',
    date: 'May 22, 2026',
    aiReview: 'AI Diagnostics: Poor visibility warning indicator. Minor hazard level. Resolved via painting crew dispatch.',
    address: 'Sector 2 Main Crossing, Arera Colony, Bhopal',
  },

  // VIP Road & Upper Lake (Scenic area - Sanitation/Safety)
  {
    id: 'rep-13',
    coordinates: [77.3820, 23.2620],
    category: 'Sanitation',
    severity: 8,
    description: 'Plastic trash floating in the lake and accumulating near VIP Road view point.',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop',
    upvotes: 134,
    department: 'Sanitation Dept',
    status: 'Pending',
    date: 'May 25, 2026',
    aiReview: 'AI Diagnostics: High accumulation of non-biodegradable waste in freshwater zone. Impact: high aquatic bio-toxicity.',
    address: 'Lake Promenade, VIP Road, Bhopal',
  },
  {
    id: 'rep-14',
    coordinates: [77.3680, 23.2550],
    category: 'Utility',
    severity: 5,
    description: 'Broken lake barrier fence on VIP road, poses a risk of accidents.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&auto=format&fit=crop',
    upvotes: 41,
    department: 'Municipal Corporation (PWD)',
    status: 'Assigned',
    date: 'May 24, 2026',
    aiReview: 'AI Diagnostics: Integrity failure of physical safety guardrail. Pedestrian fall risk identified near shoreline.',
    address: 'Near Boat Club, VIP Road, Upper Lake, Bhopal',
  },

  // Old Bhopal (Ch चौक / Jahangirabad - Narrow crowded streets)
  {
    id: 'rep-15',
    coordinates: [77.4080, 23.2600],
    category: 'Water',
    severity: 9,
    description: 'Sewage water flowing out on the busy market street in Chowk Bazaar.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&auto=format&fit=crop',
    upvotes: 195,
    department: 'Water Works Dept',
    status: 'In Progress',
    date: 'May 25, 2026',
    aiReview: 'AI Diagnostics: High-severity sewer line surcharge. High potential for public health hazard and commercial disruption.',
    address: 'Chowk Bazaar Main Market, Old Bhopal, Bhopal',
  },
  {
    id: 'rep-16',
    coordinates: [77.4120, 23.2580],
    category: 'Utility',
    severity: 7,
    description: 'Completely burnt out transformer leaving 50 shops in Jahangirabad without power.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&auto=format&fit=crop',
    upvotes: 82,
    department: 'MPEB (Electricity Board)',
    status: 'Pending',
    date: 'May 26, 2026',
    aiReview: 'AI Diagnostics: Thermal damage to neighborhood sub-station. Total phase loss. Transformer replacement required.',
    address: 'Jahangirabad Commercial Area, Bhopal',
  },
  {
    id: 'rep-17',
    coordinates: [77.4050, 23.2650],
    category: 'Sanitation',
    severity: 8,
    description: 'Piles of commercial market packaging waste dumped on secondary roads.',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop',
    upvotes: 45,
    department: 'Sanitation Dept',
    status: 'Pending',
    date: 'May 26, 2026',
    aiReview: 'AI Diagnostics: Commercial packaging refuse dump blocking pedestrian pathway. Fines recommended for regional vendors.',
    address: 'Hanuman Ganj Road, Old Bhopal, Bhopal',
  },
];;

export const getMapHtml = (reports: any[], theme: 'light' | 'dark' = 'light') => {
  const geojson = {
    type: 'FeatureCollection',
    features: reports.map((r) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: r.coordinates,
      },
      properties: {
        id: r.id,
        coordinates: r.coordinates,
        category: r.category,
        severity: r.severity,
        description: r.description,
        image: r.image,
        upvotes: r.upvotes,
        department: r.department,
        status: r.status,
        date: r.date,
        aiReview: (r as any).aiReview,
        address: r.address || 'Bhopal City',
      },
    })),
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>CivicTwin Bhopal Map</title>
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/maplibre-gl/4.1.2/maplibre-gl.js"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/maplibre-gl/4.1.2/maplibre-gl.css" rel="stylesheet" />
  <style>
    body { margin: 0; padding: 0; background-color: #0b0f19; overflow: hidden; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; height: 100%; }
    
    /* Custom Marker Container (positioned by MapLibre, no transform transitions!) */
    .custom-marker-container {
      width: 36px;
      height: 36px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    /* Custom Marker Visual Element (inside container, handles hover scaling transition) */
    .custom-marker {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid #a7f3d0; /* Muted pastel green */
      box-shadow: 0 0 12px rgba(167, 243, 208, 0.4);
      background-size: cover;
      background-position: center;
      background-color: #3b82f6; /* Fallback blue */
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s, box-shadow 0.3s;
    }
    
    .custom-marker-container:hover .custom-marker {
      transform: scale(1.2) translateY(-4px);
      z-index: 999;
    }
    
    /* Severity border colors - Muted pastels */
    .border-high { border-color: #fca5a5; box-shadow: 0 0 15px rgba(252, 165, 165, 0.6); }
    .border-medium { border-color: #fdbb2d; box-shadow: 0 0 15px rgba(253, 187, 45, 0.5); }
    .border-low { border-color: #fef08a; box-shadow: 0 0 12px rgba(254, 240, 138, 0.4); }
    
    /* Pin label marker overlay */
    .marker-label {
      position: absolute;
      bottom: -18px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(15, 23, 42, 0.9);
      color: #ffffff;
      padding: 1px 6px;
      border-radius: 6px;
      font-size: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      white-space: nowrap;
      border: 1px solid rgba(255, 255, 255, 0.15);
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script>
    let map;
    const geojsonData = ${JSON.stringify(geojson)};
    let activeMarkers = [];
    let isSatelliteVisible = 'none';
    window.currentTheme = '${theme}';

    function initMap() {
      if (!window.maplibregl) {
        setTimeout(initMap, 50);
        return;
      }

      const styleUrl = window.currentTheme === 'light' 
        ? 'https://tiles.openfreemap.org/styles/bright' 
        : 'https://tiles.openfreemap.org/styles/dark';

      map = new maplibregl.Map({
        container: 'map',
        style: styleUrl,
        center: [77.4126, 23.2599], // Bhopal center
        zoom: 12.8,
        pitch: 60, // 3D perspective
        bearing: -15,
        dragRotate: true,
        maxZoom: 18,
        minZoom: 10
      });

      map.on('rotate', () => {
        sendToRN({
          type: 'MAP_ROTATE',
          bearing: map.getBearing()
        });
      });

      map.on('style.load', () => {
        // Add ESRI Satellite Source and Layer
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
            layout: { visibility: isSatelliteVisible }
          });
        }

        // Add Heatmap Source
        if (!map.getSource('reports')) {
          map.addSource('reports', {
            type: 'geojson',
            data: geojsonData
          });
        }

        if (!map.getLayer('reports-heatmap')) {
          // Add Snapchat-style Heatmap Layer
          map.addLayer({
            id: 'reports-heatmap',
            type: 'heatmap',
            source: 'reports',
            maxzoom: 14.5,
            paint: {
              // Increase weight based on severity & upvotes
              'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'severity'],
                1, 0.2,
                10, 1.5
              ],
              // Intensity multiplier
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10, 1,
                14.5, 3
              ],
              // Color ramp (Snapchat thermal styling)
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-value'],
                0, 'rgba(0, 0, 255, 0)',
                0.2, 'rgba(146, 229, 236, 0.5)',  // Electric Aqua
                0.4, 'rgba(56, 189, 248, 0.7)',
                0.6, 'rgba(234, 179, 8, 0.85)',   // Yellow
                0.8, 'rgba(249, 115, 22, 0.95)',  // Orange
                1, 'rgba(255, 111, 0, 1)'        // Pumpkin Spice
              ],
              // Radius based on zoom
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10, 12,
                14.5, 28
              ],
              // Fade out heatmap when zooming in
              'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                13.5, 1.0,
                14.5, 0.0
              ]
            }
          });
        }

        // Add 3D building extrusion dynamically with fallback heights
        if (!map.getLayer('3d-buildings')) {
          const buildingColor = window.currentTheme === 'light' ? '#cbd5e1' : '#1e293b';
          map.addLayer({
            'id': '3d-buildings',
            'source': 'openmaptiles',
            'source-layer': 'building',
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': buildingColor,
              'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 18],
              'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
              'fill-extrusion-opacity': 0.75
            }
          });
        }

        // Render marker thumbnails when zoomed in (clusters dissolve)
        updateZoomMarkers();
        
        // Update markers on zoom and move
        map.off('zoom', updateZoomMarkers);
        map.off('moveend', updateZoomMarkers);
        map.on('zoom', updateZoomMarkers);
        map.on('moveend', updateZoomMarkers);
   
        // Handle raw map clicks to report a new location
        map.off('click');
        map.on('click', (e) => {
          if (window.justClickedMarker) {
            window.justClickedMarker = false;
            return;
          }
          
          sendToRN({
            type: 'MAP_CLICK',
            coordinates: {
              latitude: e.lngLat.lat,
              longitude: e.lngLat.lng
            }
          });
        });
      });
    }

    // Toggle between 3D Vector map and Satellite mode
    window.toggleMapMode = (mode) => {
      isSatelliteVisible = mode === 'satellite' ? 'visible' : 'none';
      if (map && map.getLayer('satellite-layer')) {
        map.setLayoutProperty('satellite-layer', 'visibility', isSatelliteVisible);
      }
    };

    // Toggle map theme style
    window.setMapTheme = (themeName) => {
      window.currentTheme = themeName;
      const styleUrl = themeName === 'light' 
        ? 'https://tiles.openfreemap.org/styles/bright' 
        : 'https://tiles.openfreemap.org/styles/dark';
      if (map) {
        map.setStyle(styleUrl);
      }
    };

    // Fly to coordinates
    window.flyToLocation = (lat, lng, zoom = 15.5) => {
      if (map) {
        map.flyTo({
          center: [lng, lat],
          zoom: zoom,
          essential: true,
          pitch: 60,
          speed: 1.2
        });
      }
    };

    let isRotationLocked = false;
    // Reset North bearing
    window.resetNorth = () => {
      if (map) {
        map.easeTo({
          bearing: 0,
          pitch: 60,
          duration: 800
        });
      }
    };

    // Toggle rotation lock
    window.toggleRotationLock = (locked) => {
      isRotationLocked = locked;
      if (map) {
        if (isRotationLocked) {
          map.dragRotate.disable();
          map.touchZoomRotate.disableRotation();
        } else {
          map.dragRotate.enable();
          map.touchZoomRotate.enableRotation();
        }
      }
    };

    // Dynamic reports update layer
    window.updateReports = (newReportsList) => {
      const geojson = {
        type: 'FeatureCollection',
        features: newReportsList.map(r => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: r.coordinates },
          properties: r
        }))
      };
      
      // Update geojsonData global variable
      geojsonData.features = geojson.features;
      
      if (map && map.getSource('reports')) {
        map.getSource('reports').setData(geojson);
      }
      updateZoomMarkers();
    };

    // Helper to send messages to React Native Webview
    function sendToRN(data) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      } else {
        // Fallback for standard iframe web communication
        window.parent.postMessage(JSON.stringify(data), '*');
      }
    }

    // Web iframe message receiver
    window.addEventListener('message', (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'toggleMapMode') {
          window.toggleMapMode(msg.mode);
        } else if (msg.type === 'setMapTheme') {
          window.setMapTheme(msg.theme);
        } else if (msg.type === 'updateReports') {
          window.updateReports(msg.list);
        } else if (msg.type === 'resetNorth') {
          window.resetNorth();
        } else if (msg.type === 'toggleRotationLock') {
          window.toggleRotationLock(msg.locked);
        } else if (msg.type === 'flyToLocation') {
          window.flyToLocation(msg.lat, msg.lng, msg.zoom);
        }
      } catch (err) {}
    });

    // Toggle markers based on zoom level (visible only at close zoom)
    function updateZoomMarkers() {
      if (!map) return;
      const zoom = map.getZoom();

      // Clear existing markers
      activeMarkers.forEach(m => m.remove());
      activeMarkers = [];

      // Always display custom markers
      geojsonData.features.forEach((feature) => {
        const props = feature.properties;
        const coords = feature.geometry.coordinates;

        // Create DOM container
        const container = document.createElement('div');
        container.className = 'custom-marker-container';

        // Create DOM visual element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundImage = 'url(' + props.image + ')';

        // Assign border color based on severity
        if (props.severity >= 8) {
          el.classList.add('border-high');
        } else if (props.severity >= 5) {
          el.classList.add('border-medium');
        } else {
          el.classList.add('border-low');
        }

        container.appendChild(el);

        // Add Category Label overlay only when zoomed in past 14
        if (zoom >= 14) {
          const label = document.createElement('div');
          label.className = 'marker-label';
          label.innerText = props.category + ' (Lvl ' + props.severity + ')';
          container.appendChild(label);
        }

        // Add click event to the container
        container.addEventListener('click', (e) => {
          e.stopPropagation();
          window.justClickedMarker = true;
          setTimeout(() => { window.justClickedMarker = false; }, 350);
          sendToRN({
            type: 'SHOW_REPORT',
            data: props
          });
          // Center map on marker on click
          map.easeTo({
            center: coords,
            pitch: 60,
            duration: 500
          });
        });

        // Add to map
        const marker = new maplibregl.Marker({ element: container })
          .setLngLat(coords)
          .addTo(map);

        activeMarkers.push(marker);
      });
    }

    document.addEventListener('DOMContentLoaded', initMap);
  </script>
</body>
</html>
  `;
};
