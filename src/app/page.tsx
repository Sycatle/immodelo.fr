"use client";

import { useEffect, useState } from "react";
import { EstimationForm } from "@/components/forms/EstimationForm";
import { HouseIcon } from "lucide-react";
import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("@/components/Map.client").then((mod) => mod.Map),
  { ssr: false }
);

export default function EstimationPage() {
  const [addressLabel, setAddressLabel] = useState("Le Mans");
  const [coords, setCoords] = useState<[number, number]>([48.0061, 0.1996]);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js";
    script.async = true;
    script.onload = () => {
      // appelle l’API interne pour récupérer le JWT
      fetch("/api/mapkit-token")
        .then((res) => res.json())
        .then(({ token }) => {
          // initialise MapKit
          // @ts-ignore
          mapkit.init({
            authorizationCallback: (done: (token: string) => void) =>
              done(token),
          });
          // crée la carte centrée sur Le Mans
          // @ts-ignore
          new mapkit.Map("apple-map", {
            center: new mapkit.Coordinate(48.0061, 0.1996),
            span: new mapkit.CoordinateSpan(0.1, 0.1),
            showsCompass: false,
            showsScale: false,
          });
        });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 relative">
        <div className="flex gap-2 justify-start px-4 lg:px-6 py-4 bg-white border-b fixed top-0 z-50 shadow-sm w-full">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
              <HouseIcon className="h-4 w-4 text-white" />
            </div>
            Immodelo
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 lg:px-6 py-16">
          <div className="w-full">
            <EstimationForm
              onAddressSelect={(label, c) => {
                setAddressLabel(label);
                setCoords(c);
              }}
            />
          </div>
        </div>
      </div>

      {/* === ici on remplace l’image par la carte === */}
      <div className="relative hidden lg:block bg-gray-300">
        <Map position={coords} label={addressLabel} />
      </div>
    </div>
  );
}
