import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TBM_COLORS } from '../data/constants';

const UK_CENTER = [54.0, -2.0];
const UK_ZOOM = 6;

export default function UKMap({ projects, yards, selectedProject, onSelectProject, playerFleet }) {
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

    // Add zoom control to top-right
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

    // Clear old markers
    for (const m of markersRef.current) {
      map.removeLayer(m);
    }
    markersRef.current = [];

    // Yard markers (diamond shape)
    for (const yard of yards) {
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: 14px; height: 14px;
          background: #f97316;
          border: 2px solid #fff;
          transform: rotate(45deg);
          box-shadow: 0 0 6px rgba(249,115,22,0.6);
        "></div>
        <div style="
          position: absolute; top: -4px; left: 20px;
          color: #9ca3af; font-size: 10px; font-family: monospace;
          white-space: nowrap; text-shadow: 0 0 4px #000;
        ">${yard.name}</div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      const marker = L.marker([yard.lat, yard.lng], { icon, interactive: false }).addTo(map);
      markersRef.current.push(marker);
    }

    // Build set of TBM-assigned project IDs
    const tbmOnProject = new Set();
    for (const tbm of playerFleet) {
      if ((tbm.status === 'on_site' || tbm.status === 'in_transit') && tbm.assignedProject) {
        tbmOnProject.add(tbm.assignedProject);
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

      const size = isSelected ? 18 : 14;
      const half = size / 2;

      // Build pin HTML
      let html = '';

      // Pulse ring for waiting projects
      if (isWaiting) {
        html += `<div style="
          position: absolute; top: 50%; left: 50%;
          width: ${size + 10}px; height: ${size + 10}px;
          margin-left: -${(size + 10) / 2}px; margin-top: -${(size + 10) / 2}px;
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
          width: ${size + 6}px; height: ${size + 6}px;
          margin-left: -${(size + 6) / 2}px; margin-top: -${(size + 6) / 2}px;
          border: 2px solid #fff;
          border-radius: 50%;
        "></div>`;
      }

      // Main circle
      html += `<div style="
        position: absolute; top: 50%; left: 50%;
        width: ${size}px; height: ${size}px;
        margin-left: -${half}px; margin-top: -${half}px;
        border-radius: 50%;
        border: 2px solid ${color};
        background: ${isActive ? color : 'rgba(0,0,0,0.6)'};
        box-shadow: 0 0 ${isWaiting ? '8' : '4'}px ${color}80;
      "></div>`;

      // Urgency exclamation
      if (isWaiting && urgency >= 2) {
        html += `<div style="
          position: absolute; top: -6px; left: 50%;
          transform: translateX(-50%);
          color: #ef4444; font-weight: bold; font-size: 12px;
          text-shadow: 0 0 4px #000;
        ">!</div>`;
      }

      // TBM indicator square
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
          position: absolute; top: -4px; left: ${half + 8}px;
          color: #fff; font-size: 11px; font-family: monospace;
          white-space: nowrap; text-shadow: 0 0 6px #000;
          background: rgba(0,0,0,0.7); padding: 1px 4px; border-radius: 3px;
        ">${project.name}</div>`;
      }

      const icon = L.divIcon({
        className: '',
        html: `<div style="position:relative;width:30px;height:30px;">${html}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([project.lat, project.lng], { icon }).addTo(map);
      marker.on('click', () => onSelectProject(project.id));
      markersRef.current.push(marker);
    }
  }, [projects, yards, selectedProject, playerFleet, onSelectProject]);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ height: '100%', minHeight: '400px' }}
    />
  );
}
