"use client";

import { useState } from "react";
import { EstimationForm } from "@/components/forms/EstimationForm";
import { ProgressBar } from "@/components/forms/ProgressBar";
import { HouseIcon } from "lucide-react";
import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("@/components/Map.client").then((mod) => mod.Map),
  { ssr: false }
);

export default function EstimationPage() {
  const [addressLabel, setAddressLabel] = useState("Le Mans");
  const [coords, setCoords] = useState<[number, number]>([48.0061, 0.1996]);
  const [step, setStep] = useState(1);

  return (
    <>
      <header className="flex gap-2 justify-start px-4 lg:px-6 py-4 bg-white border-b fixed top-0 z-50 shadow-sm w-full">
        <a href="#" className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
            <HouseIcon className="h-4 w-4 text-white" />
          </div>
          Immodelo
        </a>
      </header>
      <div className="fixed left-0 right-0 top-16 z-40">
        <div className="relative h-1">
          <ProgressBar step={step} />
        </div>
      </div>
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col gap-4 relative lg:h-screen lg:overflow-y-auto bg-white">
          <div className="flex flex-1 items-center justify-center px-4 lg:px-6 py-16">
          <div className="w-full">
            <EstimationForm
              step={step}
              setStep={setStep}
              onAddressSelect={(label, c) => {
                setAddressLabel(label);
                setCoords(c);
              }}
            />
          </div>
        </div>
        </div>

        <div className="relative z-40 hidden lg:block bg-gray-300">
          <Map position={coords} label={addressLabel} />
        </div>
      </div>

      <footer className="flex items-center justify-center py-4 bg-white border-t">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Immodelo. Tous droits réservés.
        </p>
      </footer>
    </>
  );
}
