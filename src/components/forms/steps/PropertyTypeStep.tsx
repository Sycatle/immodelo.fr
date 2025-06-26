"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Touched } from "../types";

interface PropertyTypeStepProps {
  propertyType: string;
  propertyTypeValid: boolean;
  touched: Touched;
  setPropertyType: (v: string) => void;
  setTouched: React.Dispatch<React.SetStateAction<Touched>>;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

const options = [
  { value: "maison", label: "Maison" },
  { value: "appartement", label: "Appartement" },
  { value: "duplex", label: "Duplex" },
  { value: "triplex", label: "Triplex" },
  { value: "loft", label: "Loft / Atelier" },
  { value: "hotel-particulier", label: "Hotel particulier" },
];

export function PropertyTypeStep({
  propertyType,
  propertyTypeValid,
  touched,
  setPropertyType,
  setTouched,
  onNext,
  onBack,
  isValid,
}: PropertyTypeStepProps) {
  return (
    <motion.form
      key="step-property-type"
      layout
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched({ ...touched, propertyType: true });
        if (!isValid) return;
        onNext();
      }}
    >
      <div>
        <Label className="p-1">Quel type de bien ?</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {options.map((opt) => (
            <label
              key={opt.value}
              className={`border rounded-md p-4 text-center cursor-pointer select-none ${propertyType === opt.value ? "border-orange-500 ring-2 ring-orange-500" : "border-gray-300"}`}
            >
              <input
                type="radio"
                value={opt.value}
                checked={propertyType === opt.value}
                onChange={() => setPropertyType(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {touched.propertyType && !propertyTypeValid && (
          <p
            id="propertyType-error"
            role="alert"
            className="text-sm text-red-500 mt-1"
          >
            Type de bien invalide
          </p>
        )}
      </div>
      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="w-1/2">
          Retour
        </Button>
        <Button type="submit" disabled={!isValid} className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white">
          Étape suivante
        </Button>
      </div>
    </motion.form>
  );
}
