"use client";

// Étape permettant de choisir le type de bien (maison, appartement, etc.).
// Ce choix conditionne la sélection des ventes comparables.
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import type { Touched } from "../types";

interface PropertyTypeStepProps {
  propertyType: string;
  propertyTypeValid: boolean;
  touched: Touched;
  setPropertyType: (v: string) => void;
  setTouched: React.Dispatch<React.SetStateAction<Touched>>;
  onNext: () => void;
  formId: string;
  isValid: boolean;
}

const options = [
  { value: "maison", label: "Maison" },
  { value: "appartement", label: "Appartement" },
  { value: "terrain", label: "Terrain" },
];

export function PropertyTypeStep({
  propertyType,
  propertyTypeValid,
  touched,
  setPropertyType,
  setTouched,
  onNext,
  formId,
  isValid,
}: PropertyTypeStepProps) {
  return (
    <motion.form
      id={formId}
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
        <Label className="p-1">
          Quel type de bien ? <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
          {options.map((opt) => (
            <label
              key={opt.value}
              className={`border rounded-md p-4 text-center cursor-pointer select-none duration-200 ${propertyType === opt.value ? "border-orange-500 ring-2 ring-orange-500" : "border-gray-300"}`}
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
    </motion.form>
  );
}
