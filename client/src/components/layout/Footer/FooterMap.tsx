import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './FooterMap.css';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

interface FooterMapProps {
    center: [number, number];
    zoom?: number;
    address: string;
}

export const FooterMap: React.FC<FooterMapProps> = ({ center, zoom = 16, address }) => {
    const customIcon = L.divIcon({
        className: 'custom-marker-wrapper',
        html: `
            <div class="custom-marker">
                <div class="custom-marker__circle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </div>
                <div class="custom-marker__label">${address}</div>
            </div>
        `,
        iconSize: [200, 60],
        iconAnchor: [100, 30],
        popupAnchor: [0, -30],
    });

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            className="footer-map"
            attributionControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={center} icon={customIcon}>
                <Popup>{address}</Popup>
            </Marker>
        </MapContainer>
    );
};