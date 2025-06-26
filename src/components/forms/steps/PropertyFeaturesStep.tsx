"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface PropertyFeaturesStepProps {
  partyWalls: boolean;
  basement: boolean;
  hasParking: boolean;
  parkingSpots: string;
  hasOutbuildings: boolean;
  outbuildings: string;
  exceptionalView: boolean;
  pool: boolean;
  sewer: boolean;
  setPartyWalls: (v: boolean) => void;
  setBasement: (v: boolean) => void;
  setHasParking: (v: boolean) => void;
  setParkingSpots: (v: string) => void;
  setHasOutbuildings: (v: boolean) => void;
  setOutbuildings: (v: string) => void;
  setExceptionalView: (v: boolean) => void;
  setPool: (v: boolean) => void;
  setSewer: (v: boolean) => void;
  onNext: () => void;
  formId: string;
  isValid: boolean;
}

export function PropertyFeaturesStep({
  partyWalls,
  basement,
  hasParking,
  parkingSpots,
  hasOutbuildings,
  outbuildings,
  exceptionalView,
  pool,
  sewer,
  setPartyWalls,
  setBasement,
  setHasParking,
  setParkingSpots,
  setHasOutbuildings,
  setOutbuildings,
  setExceptionalView,
  setPool,
  setSewer,
  onNext,
  formId,
  isValid,
}: PropertyFeaturesStepProps) {
  return (
    <motion.form
      id={formId}
      key="step-property-features"
      layout
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValid) return;
        onNext();
      }}
    >
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
    </motion.form>
  );
}

