"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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
  totalSurface: string;
  buildableSurface: string;
  rooms: string;
  bathrooms: string;
  levels: string;
  condition: string;
  outdoorSpaces: string[];
  partyWalls: boolean;
  basement: boolean;
  hasParking: boolean;
  parkingSpots: string;
  hasOutbuildings: boolean;
  outbuildings: string;
  exceptionalView: boolean;
  pool: boolean;
  sewer: boolean;
  dpe: string;
  yearBuilt: string;
  houseQuality: string;
  brightness: string;
  noise: string;
  transportProximity: string;
  roofQuality: string;
  occupation: string;
  urgency: string;
  surfaceValid: boolean;
  roomsValid: boolean;
  conditionValid: boolean;
  yearBuiltValid: boolean;
  touched: Touched;
  setSurface: (v: string) => void;
  setTotalSurface: (v: string) => void;
  setBuildableSurface: (v: string) => void;
  setRooms: (v: string) => void;
  setBathrooms: (v: string) => void;
  setLevels: (v: string) => void;
  setCondition: (v: string) => void;
  setOutdoorSpaces: (v: string[]) => void;
  setPartyWalls: (v: boolean) => void;
  setBasement: (v: boolean) => void;
  setHasParking: (v: boolean) => void;
  setParkingSpots: (v: string) => void;
  setHasOutbuildings: (v: boolean) => void;
  setOutbuildings: (v: string) => void;
  setExceptionalView: (v: boolean) => void;
  setPool: (v: boolean) => void;
  setSewer: (v: boolean) => void;
  setDpe: (v: string) => void;
  setYearBuilt: (v: string) => void;
  setHouseQuality: (v: string) => void;
  setBrightness: (v: string) => void;
  setNoise: (v: string) => void;
  setTransportProximity: (v: string) => void;
  setRoofQuality: (v: string) => void;
  setOccupation: (v: string) => void;
  setUrgency: (v: string) => void;
  setTouched: React.Dispatch<React.SetStateAction<Touched>>;
  onNext: () => void;
  formId: string;
  isValid: boolean;
}

export function PropertyStep({
  surface,
  totalSurface,
  buildableSurface,
  rooms,
  bathrooms,
  levels,
  condition,
  outdoorSpaces,
  partyWalls,
  basement,
  hasParking,
  parkingSpots,
  hasOutbuildings,
  outbuildings,
  exceptionalView,
  pool,
  sewer,
  dpe,
  yearBuilt,
  houseQuality,
  brightness,
  noise,
  transportProximity,
  roofQuality,
  occupation,
  urgency,
  surfaceValid,
  roomsValid,
  conditionValid,
  yearBuiltValid,
  touched,
  setSurface,
  setTotalSurface,
  setBuildableSurface,
  setRooms,
  setBathrooms,
  setLevels,
  setCondition,
  setOutdoorSpaces,
  setPartyWalls,
  setBasement,
  setHasParking,
  setParkingSpots,
  setHasOutbuildings,
  setOutbuildings,
  setExceptionalView,
  setPool,
  setSewer,
  setDpe,
  setYearBuilt,
  setHouseQuality,
  setBrightness,
  setNoise,
  setTransportProximity,
  setRoofQuality,
  setOccupation,
  setUrgency,
  setTouched,
  onNext,
  formId,
  isValid,
}: PropertyStepProps) {
  const [localTouched, setLocalTouched] = useState({
    condition: false,
    yearBuilt: false,
  });

  const localValid = conditionValid && yearBuiltValid;

  return (
    <motion.form
      id={formId}
      key="step3"
      layout
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        setLocalTouched({ condition: true, yearBuilt: true });
        if (!localValid || !isValid) return;
        onNext();
      }}
    >
      <div>
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
            className={
              "w-full " +
              cn(localTouched.condition && !conditionValid && "border-red-500")
            }
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
          autoComplete="off"
          aria-invalid={touched.surface && !surfaceValid}
          aria-describedby={
            touched.surface && !surfaceValid ? "surface-error" : undefined
          }
          className={cn(touched.surface && !surfaceValid && "border-red-500")}
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
      </div>
      <div>
        <Label className="p-1" htmlFor="totalSurface">
          Surface totale du terrain (m²)
        </Label>
        <Input
          id="totalSurface"
          type="number"
          value={totalSurface}
          onChange={(e) => setTotalSurface(e.target.value)}
          placeholder="300"
          autoComplete="off"
        />
      </div>
      <div>
        <Label className="p-1" htmlFor="buildableSurface">
          Surface constructible restante (m²)
        </Label>
        <Input
          id="buildableSurface"
          type="number"
          value={buildableSurface}
          onChange={(e) => setBuildableSurface(e.target.value)}
          placeholder="50"
          autoComplete="off"
        />
      </div>
      <div>
        <Label className="p-1" htmlFor="rooms">
          Nombre de pièces
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
      </div>
      <div>
        <Label className="p-1" htmlFor="bathrooms">
          Nombre de salles de bain
        </Label>
        <Input
          id="bathrooms"
          type="number"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          placeholder="1"
          autoComplete="off"
        />
      </div>
      <div>
        <Label className="p-1" htmlFor="levels">
          Nombre de niveaux
        </Label>
        <Input
          id="levels"
          type="number"
          value={levels}
          onChange={(e) => setLevels(e.target.value)}
          placeholder="2"
          autoComplete="off"
        />
      </div>
      <div>
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
      </div>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={partyWalls}
            onChange={(e) => setPartyWalls(e.target.checked)}
            className="mt-0.5"
          />
          Murs mitoyens
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={basement}
            onChange={(e) => setBasement(e.target.checked)}
            className="mt-0.5"
          />
          Sous-sol
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={hasParking}
            onChange={(e) => setHasParking(e.target.checked)}
            className="mt-0.5"
          />
          Places de parking
        </label>
        {hasParking && (
          <Input
            id="parkingSpots"
            type="number"
            value={parkingSpots}
            onChange={(e) => setParkingSpots(e.target.value)}
            placeholder="ex : 2"
            autoComplete="off"
            className="ml-4"
          />
        )}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={hasOutbuildings}
            onChange={(e) => setHasOutbuildings(e.target.checked)}
            className="mt-0.5"
          />
          Bâtiments annexes
        </label>
        {hasOutbuildings && (
          <Input
            id="outbuildings"
            type="number"
            value={outbuildings}
            onChange={(e) => setOutbuildings(e.target.value)}
            placeholder="ex : 1"
            autoComplete="off"
            className="ml-4"
          />
        )}
        <div>
          <Label className="p-1" htmlFor="dpe">
            Diagnostic de Performance Energétique
          </Label>
          <Select value={dpe} onValueChange={setDpe}>
            <SelectTrigger id="dpe">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              {["A", "B", "C", "D", "E", "F", "G"].map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="p-1" htmlFor="houseQuality">
            Qualité de la maison
          </Label>
          <Select value={houseQuality} onValueChange={setHouseQuality}>
            <SelectTrigger id="houseQuality">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inférieure">Inférieure</SelectItem>
              <SelectItem value="Comparable">Comparable</SelectItem>
              <SelectItem value="Supérieure">Supérieure</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="p-1" htmlFor="brightness">
            Luminosité
          </Label>
          <Select value={brightness} onValueChange={setBrightness}>
            <SelectTrigger id="brightness">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sombre">Sombre</SelectItem>
              <SelectItem value="Peu clair">Peu clair</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Clair">Clair</SelectItem>
              <SelectItem value="Très clair">Très clair</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="p-1" htmlFor="noise">
            Calme
          </Label>
          <Select value={noise} onValueChange={setNoise}>
            <SelectTrigger id="noise">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Très bruyant">Très bruyant</SelectItem>
              <SelectItem value="Bruyant">Bruyant</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Calme">Calme</SelectItem>
              <SelectItem value="Très calme">Très calme</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="p-1" htmlFor="transport">
            Proximité des transports
          </Label>
          <Select
            value={transportProximity}
            onValueChange={setTransportProximity}
          >
            <SelectTrigger id="transport">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Très éloigné">Très éloigné</SelectItem>
              <SelectItem value="Éloigné">Éloigné</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Proche">Proche</SelectItem>
              <SelectItem value="Très proche">Très proche</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="p-1" htmlFor="roofQuality">
            Qualité de la toiture
          </Label>
          <Select value={roofQuality} onValueChange={setRoofQuality}>
            <SelectTrigger id="roofQuality">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="À rénover">À rénover</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Refaite à neuf">Refaite à neuf</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={exceptionalView}
            onChange={(e) => setExceptionalView(e.target.checked)}
            className="mt-0.5"
          />
          Vue exceptionnelle
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={pool}
            onChange={(e) => setPool(e.target.checked)}
            className="mt-0.5"
          />
          Piscine
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sewer}
            onChange={(e) => setSewer(e.target.checked)}
            className="mt-0.5"
          />
          Raccordement au réseau d’évacuation des eaux usées
        </label>
      </div>
      <div>
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
      </div>
      <div>
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
      </div>
      <div>
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
      </div>
    </motion.form>
  );
}
