// Map HTML template using MapLibre GL JS and OpenFreeMap

export const BHOPAL_COORDINATES = {
  latitude: 23.2599,
  longitude: 77.4126,
};

// Generate 25 mock reports in Bhopal
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
  },
];

export const getMapHtml = (reports: typeof MOCK_REPORTS) => {
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
        category: r.category,
        severity: r.severity,
        description: r.description,
        image: r.image,
        upvotes: r.upvotes,
        department: r.department,
        status: r.status,
        date: r.date,
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
  <script src="https://unpkg.com/maplibre-gl@4.1.2/dist/maplibre-gl.js"></script>
  <link href="https://unpkg.com/maplibre-gl@4.1.2/dist/maplibre-gl.css" rel="stylesheet" />
  <style>
    body { margin: 0; padding: 0; background-color: #0b0f19; overflow: hidden; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; height: 100%; }
    
    /* Custom Marker Styling */
    .custom-marker {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      border: 2px solid #10b981; /* Default to green/safe border */
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
      background-size: cover;
      background-position: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .custom-marker:hover {
      transform: scale(1.2) translateY(-4px);
      z-index: 999;
    }
    
    /* Severity border colors */
    .border-high { border-color: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.7); }
    .border-medium { border-color: #f97316; box-shadow: 0 0 15px rgba(249, 115, 22, 0.6); }
    .border-low { border-color: #eab308; box-shadow: 0 0 12px rgba(234, 179, 8, 0.5); }
    
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
    // Initialize the MapLibre Map
    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles.openfreemap.org/styles/3d', // 3D openfreemap style
      center: [77.4126, 23.2599], // Bhopal center
      zoom: 12.8,
      pitch: 60, // 3D perspective
      bearing: -15,
      dragRotate: true,
      maxZoom: 18,
      minZoom: 10
    });

    const geojsonData = ${JSON.stringify(geojson)};
    let activeMarkers = [];

    map.on('load', () => {
      // Add ESRI Satellite Source and Layer
      map.addSource('satellite', {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256
      });

      map.addLayer({
        id: 'satellite-layer',
        type: 'raster',
        source: 'satellite',
        layout: { visibility: 'none' }
      });

      // Add Heatmap Source
      map.addSource('reports', {
        type: 'geojson',
        data: geojsonData
      });

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
            0.2, 'rgba(56, 189, 248, 0.5)',  // Ice blue
            0.4, 'rgba(16, 185, 129, 0.7)',  // Green
            0.6, 'rgba(234, 179, 8, 0.85)',   // Yellow
            0.8, 'rgba(249, 115, 22, 0.95)',  // Orange
            1, 'rgba(239, 68, 68, 1)'        // Red hot
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

      // Render marker thumbnails when zoomed in (clusters dissolve)
      updateZoomMarkers();
      
      // Update markers on zoom and move
      map.on('zoom', updateZoomMarkers);
      map.on('moveend', updateZoomMarkers);

      // Handle raw map clicks to report a new location
      map.on('click', (e) => {
        // Prevent click if clicking a marker
        if (e.originalEvent.target.classList.contains('custom-marker')) return;
        
        sendToRN({
          type: 'MAP_CLICK',
          coordinates: {
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng
          }
        });
      });
    });

    // Toggle between 3D Vector map and Satellite mode
    window.toggleMapMode = (mode) => {
      if (mode === 'satellite') {
        map.setLayoutProperty('satellite-layer', 'visibility', 'visible');
      } else {
        map.setLayoutProperty('satellite-layer', 'visibility', 'none');
      }
    };

    // Toggle map theme style
    window.setMapTheme = (themeName) => {
      const styleUrl = themeName === 'light' 
        ? 'https://tiles.openfreemap.org/styles/bright' 
        : 'https://tiles.openfreemap.org/styles/3d';
      map.setStyle(styleUrl);
    };

    // Fly to coordinates
    window.flyToLocation = (lat, lng, zoom = 15.5) => {
      map.flyTo({
        center: [lng, lat],
        zoom: zoom,
        essential: true,
        pitch: 60,
        speed: 1.2
      });
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
      
      if (map.getSource('reports')) {
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
        }
      } catch (err) {}
    });

    // Toggle markers based on zoom level (visible only at close zoom)
    function updateZoomMarkers() {
      const zoom = map.getZoom();

      // Clear existing markers
      activeMarkers.forEach(m => m.remove());
      activeMarkers = [];

      // Only display custom thumbnails if zoomed in past 14
      if (zoom >= 14) {
        geojsonData.features.forEach((feature) => {
          const props = feature.properties;
          const coords = feature.geometry.coordinates;

          // Create DOM element
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

          // Add Category Label overlay
          const label = document.createElement('div');
          label.className = 'marker-label';
          label.innerText = props.category + ' (Lvl ' + props.severity + ')';
          el.appendChild(label);

          // Add click event
          el.addEventListener('click', (e) => {
            e.stopPropagation();
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
          const marker = new maplibregl.Marker(el)
            .setLngLat(coords)
            .addTo(map);

          activeMarkers.push(marker);
        });
      }
    }
  </script>
</body>
</html>
  `;
};
