// components/Map.client.tsx
"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

interface MapProps {
  position: [number, number];
  label: string;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
    // If you want to set a specific zoom level, you can do it here
    map.setZoom(20);
  }, [center, map]);
  return null;
}

export function Map({ position, label}: MapProps) {
  return (
    <MapContainer
      center={position}
      zoom={10}
      className="h-full w-full"
      attributionControl={false}
      zoomControl={false}
      fadeAnimation={true}
      boxZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <ChangeView center={position} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
}
