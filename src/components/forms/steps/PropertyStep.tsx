"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Touched } from "../types";

interface PropertyStepProps {
  surface: string;
  propertyType: string;
  rooms: string;
  condition: string;
  outdoorSpaces: string[];
  parking: string;
  yearBuilt: string;
  occupation: string;
  urgency: string;
  surfaceValid: boolean;
  propertyTypeValid: boolean;
  roomsValid: boolean;
  conditionValid: boolean;
  yearBuiltValid: boolean;
  touched: Touched;
  setSurface: (v: string) => void;
  setPropertyType: (v: string) => void;
  setRooms: (v: string) => void;
  setCondition: (v: string) => void;
  setOutdoorSpaces: (v: string[]) => void;
  setParking: (v: string) => void;
  setYearBuilt: (v: string) => void;
  setOccupation: (v: string) => void;
  setUrgency: (v: string) => void;
  setTouched: React.Dispatch<React.SetStateAction<Touched>>;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export function PropertyStep({
  surface,
  propertyType,
  rooms,
  condition,
  outdoorSpaces,
  parking,
  yearBuilt,
  occupation,
  urgency,
  surfaceValid,
  propertyTypeValid,
  roomsValid,
  conditionValid,
  yearBuiltValid,
  touched,
  setSurface,
  setPropertyType,
  setRooms,
  setCondition,
  setOutdoorSpaces,
  setParking,
  setYearBuilt,
  setOccupation,
  setUrgency,
  setTouched,
  onNext,
  onBack,
  isValid,
}: PropertyStepProps) {
  const [localTouched, setLocalTouched] = useState({
    condition: false,
    yearBuilt: false,
  });

  const localValid = conditionValid && yearBuiltValid;

  const showSurface = propertyTypeValid;
  const showRooms = showSurface && surfaceValid;
  const showCondition = showRooms && roomsValid;
  const showExtra = showCondition && conditionValid;
  const showYearBuilt = showExtra;
  const showOccupation = showYearBuilt && yearBuiltValid;
  const showUrgency = showOccupation;

  const fadeProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.2 },
  } as const;

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
        setLocalTouched({ condition: true, yearBuilt: true });
        if (!localValid || !isValid) return;
        onNext();
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div key="propertyType" layout {...fadeProps}>
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
              aria-describedby={
                touched.propertyType && !propertyTypeValid
                  ? "propertyType-error"
                  : undefined
              }
              className={cn(
                touched.propertyType && !propertyTypeValid && "border-red-500"
              )}
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
            <p
              id="propertyType-error"
              role="alert"
              className="text-sm text-red-500 mt-1"
            >
              Type de bien invalide
            </p>
          )}
        </motion.div>

        {showSurface && (
          <motion.div key="surface" layout {...fadeProps}>
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
              autoComplete="off"
              aria-invalid={touched.surface && !surfaceValid}
              aria-describedby={
                touched.surface && !surfaceValid ? "surface-error" : undefined
              }
              className={cn(
                touched.surface && !surfaceValid && "border-red-500"
              )}
              required
            />
            {touched.surface && !surfaceValid && (
              <p
                id="surface-error"
                role="alert"
                className="text-sm text-red-500 mt-1"
              >
                Surface invalide
              </p>
            )}
          </motion.div>
        )}

        {showRooms && (
          <motion.div key="rooms" layout {...fadeProps}>
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
              autoComplete="off"
              aria-invalid={touched.rooms && !roomsValid}
              aria-describedby={
                touched.rooms && !roomsValid ? "rooms-error" : undefined
              }
              className={cn(touched.rooms && !roomsValid && "border-red-500")}
              required
            />
            {touched.rooms && !roomsValid && (
              <p
                id="rooms-error"
                role="alert"
                className="text-sm text-red-500 mt-1"
              >
                Nombre invalide
              </p>
            )}
          </motion.div>
        )}

        {showCondition && (
          <motion.div key="condition" layout {...fadeProps}>
            <Label className="p-1" htmlFor="condition">
              État général du bien
            </Label>
            <Select
              value={condition}
              onValueChange={(v) => {
                setCondition(v);
                setLocalTouched((t) => ({ ...t, condition: true }));
              }}
            >
              <SelectTrigger
                id="condition"
                aria-invalid={localTouched.condition && !conditionValid}
                aria-describedby={
                  localTouched.condition && !conditionValid
                    ? "condition-error"
                    : undefined
                }
                className={cn(
                  localTouched.condition && !conditionValid && "border-red-500"
                )}
              >
                <SelectValue placeholder="Sélectionnez l'état" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Comme neuf">Comme neuf</SelectItem>
                <SelectItem value="Bon état">Bon état</SelectItem>
                <SelectItem value="Quelques travaux">Quelques travaux</SelectItem>
                <SelectItem value="Travaux importants">
                  Travaux importants
                </SelectItem>
              </SelectContent>
            </Select>
            {localTouched.condition && !conditionValid && (
              <p
                id="condition-error"
                role="alert"
                className="text-sm text-red-500 mt-1"
              >
                Champ requis
              </p>
            )}
          </motion.div>
        )}

        {showExtra && (
          <motion.div key="outdoor" layout {...fadeProps}>
            <Label className="p-1" htmlFor="outdoorSpaces">
              Espace extérieur
            </Label>
            <div id="outdoorSpaces" className="flex flex-wrap gap-4 mt-1">
              {["Jardin", "Terrasse", "Balcon", "Aucun"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    value={opt}
                    checked={outdoorSpaces.includes(opt)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setOutdoorSpaces((prev) => {
                        if (opt === "Aucun" && checked) {
                          return ["Aucun"];
                        }
                        if (opt === "Aucun" && !checked) {
                          return [];
                        }
                        if (checked) {
                          return prev.filter((v) => v !== "Aucun").concat(opt);
                        }
                        return prev.filter((v) => v !== opt);
                      });
                    }}
                    className="mt-0.5"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </motion.div>
        )}

        {showExtra && (
          <motion.div key="parking" layout {...fadeProps}>
            <Label className="p-1" htmlFor="parking">
              Stationnement
            </Label>
            <Select value={parking} onValueChange={setParking}>
              <SelectTrigger id="parking">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aucun">Aucun</SelectItem>
                <SelectItem value="Parking collectif">Parking collectif</SelectItem>
                <SelectItem value="Garage privé">Garage privé</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        )}

        {showExtra && (
          <motion.div key="yearBuilt" layout {...fadeProps}>
            <Label className="p-1" htmlFor="yearBuilt">
              Année de construction
            </Label>
            <Input
              id="yearBuilt"
              type="number"
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value)}
              onBlur={() => setLocalTouched((t) => ({ ...t, yearBuilt: true }))}
              placeholder="ex : 1998"
              autoComplete="off"
              aria-invalid={localTouched.yearBuilt && !yearBuiltValid}
              aria-describedby={
                localTouched.yearBuilt && !yearBuiltValid
                  ? "yearBuilt-error"
                  : undefined
              }
              className={cn(
                localTouched.yearBuilt && !yearBuiltValid && "border-red-500"
              )}
            />
            {localTouched.yearBuilt && !yearBuiltValid && (
              <p
                id="yearBuilt-error"
                role="alert"
                className="text-sm text-red-500 mt-1"
              >
                Format invalide
              </p>
            )}
          </motion.div>
        )}

        {showOccupation && (
          <motion.div key="occupation" layout {...fadeProps}>
            <Label className="p-1" htmlFor="occupation">
              Occupation du bien
            </Label>
            <Select value={occupation} onValueChange={setOccupation}>
              <SelectTrigger id="occupation">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Oui, j’y habite">Oui, j’y habite</SelectItem>
                <SelectItem value="Loué">Loué</SelectItem>
                <SelectItem value="Vide">Vide</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        )}

        {showUrgency && (
          <motion.div key="urgency" layout {...fadeProps}>
            <Label className="p-1" htmlFor="urgency">
              Urgence de vente
            </Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger id="urgency">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Oui, dans les 3 mois">
                  Oui, dans les 3 mois
                </SelectItem>
                <SelectItem value="Je me renseigne">Je me renseigne</SelectItem>
                <SelectItem value="Pas encore décidé">Pas encore décidé</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        )}

        {showUrgency && (
          <motion.div
            key="buttons"
            layout
            {...fadeProps}
            className="flex justify-between gap-4"
          >
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="w-1/2"
            >
              Retour
            </Button>
            <Button
              type="submit"
              disabled={!isValid || !localValid}
              className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white"
            >
              Étape suivante
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
