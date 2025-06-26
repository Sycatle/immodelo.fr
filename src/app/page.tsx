"use client";

import { useEffect } from "react";
import { EstimationForm } from "@/components/forms/EstimationForm";
import { HouseIcon } from "lucide-react";

export default function EstimationPage() {
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
          // @ts-expect-error MapKit is loaded globally by the script tag
          mapkit.init({
            authorizationCallback: (done: (token: string) => void) =>
              done(token),
          });
          // crée la carte centrée sur Le Mans
          // @ts-expect-error MapKit is loaded globally by the script tag
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
            <EstimationForm />
          </div>
        </div>
      </div>

      {/* === ici on remplace l’image par la carte === */}
      <div className="relative hidden lg:block">
        <div id="apple-map" className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  );
}
