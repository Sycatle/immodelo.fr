"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Touched } from "../types";

interface PropertyMainStepProps {
  surface: string;
  totalSurface: string;
  buildableSurface: string;
  rooms: string;
  bathrooms: string;
  levels: string;
  surfaceValid: boolean;
  roomsValid: boolean;
  touched: Touched;
  setSurface: (v: string) => void;
  setTotalSurface: (v: string) => void;
  setBuildableSurface: (v: string) => void;
  setRooms: (v: string) => void;
  setBathrooms: (v: string) => void;
  setLevels: (v: string) => void;
  setTouched: React.Dispatch<React.SetStateAction<Touched>>;
  onNext: () => void;
  formId: string;
  isValid: boolean;
}

export function PropertyMainStep({
  surface,
  totalSurface,
  buildableSurface,
  rooms,
  bathrooms,
  levels,
  surfaceValid,
  roomsValid,
  touched,
  setSurface,
  setTotalSurface,
  setBuildableSurface,
  setRooms,
  setBathrooms,
  setLevels,
  setTouched,
  onNext,
  formId,
  isValid,
}: PropertyMainStepProps) {
  return (
    <motion.form
      id={formId}
      key="step-property-main"
      layout
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched({ ...touched, surface: true, rooms: true });
        if (!isValid) return;
        onNext();
      }}
    >
      <div>
        <Label className="p-1" htmlFor="surface">
          Surface habitable (m²) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="surface"
          type="number"
          value={surface}
          onChange={(e) => setSurface(e.target.value)}
          onBlur={() => setTouched({ ...touched, surface: true })}
          placeholder="90"
          autoComplete="off"
          aria-invalid={touched.surface && !surfaceValid}
          aria-describedby={
            touched.surface && !surfaceValid ? "surface-error" : undefined
          }
          className={cn(touched.surface && !surfaceValid && "border-red-500")}
          required
        />
        {touched.surface && !surfaceValid && (
          <p id="surface-error" role="alert" className="text-sm text-red-500 mt-1">
            Surface invalide
          </p>
        )}
      </div>
      <div>
        <Label className="p-1" htmlFor="totalSurface">
          Surface totale du terrain (m²) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="totalSurface"
          type="number"
          value={totalSurface}
          onChange={(e) => setTotalSurface(e.target.value)}
          placeholder="300"
          autoComplete="off"
          required
        />
      </div>
      <div>
        <Label className="p-1" htmlFor="buildableSurface">
          Surface constructible restante (m²) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="buildableSurface"
          type="number"
          value={buildableSurface}
          onChange={(e) => setBuildableSurface(e.target.value)}
          placeholder="50"
          autoComplete="off"
          required
        />
      </div>
      <div>
        <Label className="p-1" htmlFor="rooms">
          Nombre de pièces <span className="text-red-500">*</span>
        </Label>
        <Input
          id="rooms"
          type="number"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          onBlur={() => setTouched({ ...touched, rooms: true })}
          placeholder="ex : 3"
          autoComplete="off"
          aria-invalid={touched.rooms && !roomsValid}
          aria-describedby={touched.rooms && !roomsValid ? "rooms-error" : undefined}
          className={cn(touched.rooms && !roomsValid && "border-red-500")}
          required
        />
        {touched.rooms && !roomsValid && (
          <p id="rooms-error" role="alert" className="text-sm text-red-500 mt-1">
            Nombre invalide
          </p>
        )}
      </div>
      <div>
        <Label className="p-1" htmlFor="bathrooms">
          Nombre de salles de bain <span className="text-red-500">*</span>
        </Label>
        <Input
          id="bathrooms"
          type="number"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          placeholder="1"
          autoComplete="off"
          required
        />
      </div>
      <div>
        <Label className="p-1" htmlFor="levels">
          Nombre de niveaux <span className="text-red-500">*</span>
        </Label>
        <Input
          id="levels"
          type="number"
          value={levels}
          onChange={(e) => setLevels(e.target.value)}
          placeholder="2"
          autoComplete="off"
          required
        />
      </div>
    </motion.form>
  );
}

