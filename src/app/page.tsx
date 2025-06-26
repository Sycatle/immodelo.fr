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
  const [, setAddressLabel] = useState("Le Mans");
  const [coords, setCoords] = useState<[number, number]>([48.0061, 0.1996]);
  const [step, setStep] = useState(1);

  return (
    <>
      <header className="flex  bg-white border-b fixed top-0 z-50 shadow-sm w-full">
        <div className="relative flex items-center rounded-md gap-2 justify-start px-4 lg:px-6 py-4 w-full">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
              <HouseIcon className="h-4 w-4 text-white" />
            </div>
            Immodelo
          </a>

          <ProgressBar step={step} />
        </div>
      </header>

      <div className="grid lg:grid-cols-12 overflow-hidden h-screen">
        <div className="flex flex-col gap-4 flex-1 items-center relative lg:col-span-7 mx-auto min-h-screen overflow-y-auto w-full bg-white">
          <EstimationForm
            step={step}
            setStep={setStep}
            onAddressSelect={(label, c) => {
              setAddressLabel(label);
              setCoords(c);
            }}
          />
        </div>

        <div className="relative z-40 hidden lg:block bg-gray-300 lg:col-span-5">
          <Map position={coords} />
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
