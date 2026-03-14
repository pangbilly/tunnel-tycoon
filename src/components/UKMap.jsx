import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TBM_COLORS } from '../data/constants';

const UK_CENTER = [54.0, -2.0];
const UK_ZOOM = 6;

export default function UKMap({ projects, yards, selectedProject, onSelectProject, players }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Initialise map once
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: UK_CENTER,
      zoom: UK_ZOOM,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      dragging: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    for (const m of markersRef.current) {
      map.removeLayer(m);
    }
    markersRef.current = [];

    // Yard markers
    for (const yard of yards) {
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: 16px; height: 16px;
          background: #f97316;
          border: 2px solid #fff;
          transform: rotate(45deg);
          box-shadow: 0 0 10px rgba(249,115,22,0.5);
        "></div>
        <div style="
          position: absolute; top: -2px; left: 22px;
          color: #9ca3af; font-size: 10px; font-family: ui-monospace, monospace;
          white-space: nowrap; text-shadow: 0 0 6px #000, 0 0 3px #000;
        ">${yard.name}</div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      const marker = L.marker([yard.lat, yard.lng], { icon, interactive: false }).addTo(map);
      markersRef.current.push(marker);
    }

    // Build lookup for which player owns which project
    const playerColors = {};
    if (players) {
      for (const p of players) {
        playerColors[p.id] = p.color;
      }
    }

    // Build set of TBM positions
    const tbmOnProject = new Set();
    if (players) {
      for (const player of players) {
        for (const tbm of player.fleet) {
          if ((tbm.status === 'on_site' || tbm.status === 'in_transit') && tbm.assignedProject) {
            tbmOnProject.add(tbm.assignedProject);
          }
        }
      }
    }

    // Project markers
    for (const project of projects) {
      const color = TBM_COLORS[project.tbmSize];
      const isSelected = selectedProject === project.id;
      const isWaiting = project.status === 'waiting';
      const isActive = project.status === 'active' || project.status === 'mobilising';
      const hasTbm = tbmOnProject.has(project.id);
      const urgency = project.urgencyWeeks || 0;
      const ownerColor = playerColors[project.assignedTo] || '#f97316';
      const isPlayerProject = project.assignedTo === 'player';

      const size = isSelected ? 20 : 14;
      const half = size / 2;

      let html = '';

      // Pulse ring for waiting
      if (isWaiting && isPlayerProject) {
        html += `<div style="
          position: absolute; top: 50%; left: 50%;
          width: ${size + 12}px; height: ${size + 12}px;
          margin-left: -${(size + 12) / 2}px; margin-top: -${(size + 12) / 2}px;
          border: 2px solid ${color};
          border-radius: 50%;
          opacity: 0.5;
          animation: pulse 1.5s ease-in-out infinite;
        "></div>`;
      }

      // Selection ring
      if (isSelected) {
        html += `<div style="
          position: absolute; top: 50%; left: 50%;
          width: ${size + 8}px; height: ${size + 8}px;
          margin-left: -${(size + 8) / 2}px; margin-top: -${(size + 8) / 2}px;
          border: 2px solid #fff;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255,255,255,0.3);
        "></div>`;
      }

      // Main circle with owner indicator
      html += `<div style="
        position: absolute; top: 50%; left: 50%;
        width: ${size}px; height: ${size}px;
        margin-left: -${half}px; margin-top: -${half}px;
        border-radius: 50%;
        border: 2px solid ${color};
        background: ${isActive ? color : 'rgba(0,0,0,0.6)'};
        box-shadow: 0 0 ${isWaiting ? '10' : '4'}px ${color}60;
        ${!isPlayerProject ? `opacity: 0.6;` : ''}
      "></div>`;

      // Owner dot (for AI projects)
      if (!isPlayerProject && project.assignedTo) {
        html += `<div style="
          position: absolute; top: 50%; left: 50%;
          width: 6px; height: 6px;
          margin-left: -3px; margin-top: -3px;
          border-radius: 50%;
          background: ${ownerColor};
        "></div>`;
      }

      // Urgency exclamation
      if (isWaiting && urgency >= 3 && isPlayerProject) {
        html += `<div style="
          position: absolute; top: -8px; left: 50%;
          transform: translateX(-50%);
          color: #ef4444; font-weight: bold; font-size: 13px;
          text-shadow: 0 0 6px #000;
          animation: markerBounce 0.5s ease-in-out infinite;
        ">!</div>`;
      }

      // TBM indicator
      if (hasTbm) {
        html += `<div style="
          position: absolute; bottom: -8px; left: 50%;
          transform: translateX(-50%);
          width: 6px; height: 6px;
          background: ${color}; border: 1px solid #fff;
          border-radius: 1px;
        "></div>`;
      }

      // Label on select
      if (isSelected) {
        html += `<div style="
          position: absolute; top: -4px; left: ${half + 10}px;
          color: #fff; font-size: 11px; font-family: ui-monospace, monospace;
          white-space: nowrap; text-shadow: 0 0 8px #000;
          background: rgba(0,0,0,0.8); padding: 2px 6px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
        ">${project.name}${!isPlayerProject ? ' (' + (project.assignedTo || '?') + ')' : ''}</div>`;
      }

      const icon = L.divIcon({
        className: '',
        html: `<div style="position:relative;width:34px;height:34px;">${html}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([project.lat, project.lng], { icon }).addTo(map);
      if (isPlayerProject) {
        marker.on('click', () => onSelectProject(project.id));
      }
      markersRef.current.push(marker);
    }
  }, [projects, yards, selectedProject, players, onSelectProject]);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-xl overflow-hidden"
      style={{ height: '100%', minHeight: '400px' }}
    />
  );
}
