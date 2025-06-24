"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Touched } from "../types";

interface PropertyStepProps {
  surface: string;
  propertyType: string;
  rooms: string;
  surfaceValid: boolean;
  propertyTypeValid: boolean;
  roomsValid: boolean;
  touched: Touched;
  setSurface: (v: string) => void;
  setPropertyType: (v: string) => void;
  setRooms: (v: string) => void;
  setTouched: React.Dispatch<React.SetStateAction<Touched>>;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export function PropertyStep({
  surface,
  propertyType,
  rooms,
  surfaceValid,
  propertyTypeValid,
  roomsValid,
  touched,
  setSurface,
  setPropertyType,
  setRooms,
  setTouched,
  onNext,
  onBack,
  isValid,
}: PropertyStepProps) {
  return (
    <motion.form
      key="step2"
      layout
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div>
        <Label className="p-1" htmlFor="propertyType">
          Type de bien
        </Label>
        <Select
          value={propertyType}
          onValueChange={(v) => {
            setPropertyType(v);
            setTouched({ ...touched, propertyType: true });
          }}
        >
          <SelectTrigger
            aria-invalid={touched.propertyType && !propertyTypeValid}
            className={cn(touched.propertyType && !propertyTypeValid && "border-red-500")}
          >
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="maison">Maison</SelectItem>
            <SelectItem value="appartement">Appartement</SelectItem>
            <SelectItem value="terrain">Terrain</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
        {touched.propertyType && !propertyTypeValid && (
          <p className="text-sm text-red-500 mt-1">Type de bien invalide</p>
        )}
      </div>
      <div>
        <Label className="p-1" htmlFor="surface">
          Surface habitable (m²)
        </Label>
        <Input
          id="surface"
          type="number"
          value={surface}
          onChange={(e) => setSurface(e.target.value)}
          onBlur={() => setTouched({ ...touched, surface: true })}
          placeholder="90"
          aria-invalid={touched.surface && !surfaceValid}
          className={cn(touched.surface && !surfaceValid && "border-red-500")}
          required
        />
        {touched.surface && !surfaceValid && (
          <p className="text-sm text-red-500 mt-1">Surface invalide</p>
        )}
      </div>
      <div>
        <Label className="p-1" htmlFor="rooms">
          Nombre de chambres
        </Label>
        <Input
          id="rooms"
          type="number"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          onBlur={() => setTouched({ ...touched, rooms: true })}
          placeholder="ex : 3"
          aria-invalid={touched.rooms && !roomsValid}
          className={cn(touched.rooms && !roomsValid && "border-red-500")}
          required
        />
        {touched.rooms && !roomsValid && (
          <p className="text-sm text-red-500 mt-1">Nombre invalide</p>
        )}
      </div>
      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="w-1/2">
          Retour
        </Button>
        <Button
          type="submit"
          disabled={!isValid}
          className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white"
        >
          Étape suivante
        </Button>
      </div>
    </motion.form>
  );
}
