"use client";

// Étape dédiée aux informations détaillées sur le bien (DPE, état, etc.).
// Ces critères viennent moduler légèrement l'estimation finale.
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyDetailsStepProps {
  condition: string;
  dpe: string;
  yearBuilt: string;
  houseQuality: string;
  brightness: string;
  noise: string;
  transportProximity: string;
  roofQuality: string;
  setCondition: (v: string) => void;
  setDpe: (v: string) => void;
  setYearBuilt: (v: string) => void;
  setHouseQuality: (v: string) => void;
  setBrightness: (v: string) => void;
  setNoise: (v: string) => void;
  setTransportProximity: (v: string) => void;
  setRoofQuality: (v: string) => void;
  onNext: () => void;
  formId: string;
  isValid: boolean;
}

export function PropertyDetailsStep({
  condition,
  dpe,
  yearBuilt,
  houseQuality,
  brightness,
  noise,
  transportProximity,
  roofQuality,
  setCondition,
  setDpe,
  setYearBuilt,
  setHouseQuality,
  setBrightness,
  setNoise,
  setTransportProximity,
  setRoofQuality,
  onNext,
  formId,
  isValid,
}: PropertyDetailsStepProps) {
  return (
    <motion.form
      id={formId}
      key="step-property-details"
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
      <div>
        <Label className="p-1" htmlFor="condition">
          État du bien
        </Label>
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger id="condition">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Comme neuf">Comme neuf</SelectItem>
            <SelectItem value="Bon état">Bon état</SelectItem>
            <SelectItem value="Quelques travaux">Quelques travaux</SelectItem>
            <SelectItem value="Travaux importants">Travaux importants</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
        <Label className="p-1" htmlFor="houseQuality">Qualité de la maison</Label>
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
        <Label className="p-1" htmlFor="brightness">Luminosité</Label>
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
        <Label className="p-1" htmlFor="noise">Calme</Label>
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
        <Label className="p-1" htmlFor="transport">Proximité des transports</Label>
        <Select value={transportProximity} onValueChange={setTransportProximity}>
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
        <Label className="p-1" htmlFor="roofQuality">Qualité de la toiture</Label>
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
      <div>
        <Label className="p-1" htmlFor="yearBuilt">Année de construction</Label>
        <Input
          id="yearBuilt"
          type="number"
          value={yearBuilt}
          onChange={(e) => setYearBuilt(e.target.value)}
          placeholder="ex : 1998"
          autoComplete="off"
        />
      </div>
    </motion.form>
  );
}

