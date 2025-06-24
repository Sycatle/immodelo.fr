"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Touched } from "../types";

interface AddressStepProps {
  address: string;
  postcode: string;
  city: string;
  suggestions: string[];
  addressValid: boolean;
  postcodeValid: boolean;
  cityValid: boolean;
  touched: Touched;
  setAddress: (v: string) => void;
  setPostcode: (v: string) => void;
  setCity: (v: string) => void;
  setTouched: React.Dispatch<React.SetStateAction<Touched>>;
  onSuggestionClick: (index: number) => void;
  onNext: () => void;
  isValid: boolean;
}

export function AddressStep({
  address,
  postcode,
  city,
  suggestions,
  addressValid,
  postcodeValid,
  cityValid,
  touched,
  setAddress,
  setPostcode,
  setCity,
  setTouched,
  onSuggestionClick,
  onNext,
  isValid,
}: AddressStepProps) {
  return (
    <motion.form
      key="step1"
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
        <Label className="p-1" htmlFor="address">
          Adresse
        </Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onBlur={() => setTouched({ ...touched, address: true })}
          placeholder="12 rue de la paix"
          autoComplete="street-address"
          aria-invalid={touched.address && !addressValid}
          aria-describedby={touched.address && !addressValid ? "address-error" : undefined}
          className={cn(touched.address && !addressValid && "border-red-500")}
          required
        />
        {touched.address && !addressValid && (
          <p id="address-error" role="alert" className="text-sm text-red-500 mt-1">Adresse invalide</p>
        )}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow max-h-48 overflow-auto">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                onClick={() => onSuggestionClick(idx)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <Label className="p-1" htmlFor="postcode">
            Code postal
          </Label>
          <Input
            id="postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            onBlur={() => setTouched({ ...touched, postcode: true })}
            placeholder="72000"
            autoComplete="postal-code"
            aria-invalid={touched.postcode && !postcodeValid}
            aria-describedby={touched.postcode && !postcodeValid ? "postcode-error" : undefined}
            className={cn(touched.postcode && !postcodeValid && "border-red-500")}
            required
          />
          {touched.postcode && !postcodeValid && (
            <p id="postcode-error" role="alert" className="text-sm text-red-500 mt-1">Code postal invalide</p>
          )}
        </div>
        <div className="w-1/2">
          <Label className="p-1" htmlFor="city">
            Ville
          </Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={() => setTouched({ ...touched, city: true })}
            placeholder="Le Mans"
            autoComplete="address-level2"
            aria-invalid={touched.city && !cityValid}
            aria-describedby={touched.city && !cityValid ? "city-error" : undefined}
            className={cn(touched.city && !cityValid && "border-red-500")}
            required
          />
          {touched.city && !cityValid && (
            <p id="city-error" role="alert" className="text-sm text-red-500 mt-1">Ville invalide</p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        disabled={!isValid}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        Étape suivante
      </Button>
    </motion.form>
  );
}
