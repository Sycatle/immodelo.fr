"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence } from "framer-motion";
import { AddressStep } from "./steps/AddressStep";
import { PropertyStep } from "./steps/PropertyStep";
import { ContactStep } from "./steps/ContactStep";
import type { Touched } from "./types";
import type { EstimateInput, EstimateResult } from "@/lib/estimate";
import { toast } from "sonner";
import {
  isValidAddress,
  isValidPostcode,
  isValidCity,
  isValidSurface,
  isValidPropertyType,
  isValidRooms,
  isValidCondition,
  isValidYearBuilt,
  isValidName,
  isValidEmail,
  isValidPhone,
  splitAddress,
} from "@/lib/form-helpers";
import { useAddressSuggestions } from "@/lib/useAddressSuggestions";
import FinishStep from "./steps/FinishStep";

interface EstimationFormProps {
  step: number;
  setStep: (step: number) => void;
  onAddressSelect?: (label: string, coords: [number, number]) => void;
}
export function EstimationForm({ step, setStep, onAddressSelect }: EstimationFormProps) {

  // Step 1 states
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const { suggestions, selectSuggestion, clear } =
    useAddressSuggestions(address);

  const handleAddressBlur = () => {
    const parsed = splitAddress(address);
    setAddress(parsed.street);
    if (parsed.postcode) setPostcode(parsed.postcode);
    if (parsed.city) setCity(parsed.city);

    if (onAddressSelect) {
      const isOk =
        isValidAddress(parsed.street) &&
        isValidPostcode(parsed.postcode) &&
        isValidCity(parsed.city);
      if (isOk) {
        const query = `${parsed.street}, ${parsed.postcode} ${parsed.city}`;
        fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`
        )
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            const feature = data?.features?.[0];
            if (feature) {
              onAddressSelect(query, [
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0],
              ]);
            }
          })
          .catch(() => {
            /* ignore errors */
          });
      }
    }
  };

  // Step 2 states
  const [surface, setSurface] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [rooms, setRooms] = useState("");
  const [condition, setCondition] = useState("");
  const [outdoorSpaces, setOutdoorSpaces] = useState<string[]>([]);
  const [parking, setParking] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [occupation, setOccupation] = useState("");
  const [urgency, setUrgency] = useState("");

  // Step 3 states
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const [touched, setTouched] = useState<Touched>({
    address: false,
    postcode: false,
    city: false,
    surface: false,
    propertyType: false,
    rooms: false,
    firstname: false,
    lastname: false,
    email: false,
    phone: false,
    consent: false,
  });

  // Validations using helper utilities

  const addressValid = isValidAddress(address);
  const postcodeValid = isValidPostcode(postcode);
  const cityValid = isValidCity(city);
  const surfaceValid = isValidSurface(surface);
  const propertyTypeValid = isValidPropertyType(propertyType);
  const roomsValid = isValidRooms(rooms);
  const conditionValid = isValidCondition(condition);
  const yearBuiltValid = isValidYearBuilt(yearBuilt);
  const firstnameValid = isValidName(firstname);
  const lastnameValid = isValidName(lastname);
  const emailValid = isValidEmail(email);
  const phoneValid = isValidPhone(phone);

  // Validation checks for each step
  const isStep1Valid = addressValid && postcodeValid && cityValid;
  const isStep2Valid =
    surfaceValid &&
    propertyTypeValid &&
    roomsValid &&
    conditionValid &&
    yearBuiltValid;
  const isStep3Valid =
    firstnameValid && lastnameValid && emailValid && phoneValid && consent;

  const handleSuggestionClick = (index: number) => {
    const parsed = selectSuggestion(index);
    if (!parsed) return;
    setAddress(parsed.street);
    setPostcode(parsed.postcode);
    setCity(parsed.city);
    clear();
    if (parsed.lat && parsed.lon && onAddressSelect) {
      onAddressSelect(
        `${parsed.street}, ${parsed.postcode} ${parsed.city}`,
        [parsed.lat, parsed.lon]
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      toast.error("Merci de cocher la case de consentement.");
      return;
    }

    const data: EstimateInput = {
      address,
      postcode,
      city,
      surface: parseFloat(surface),
      propertyType,
      rooms: parseInt(rooms, 10),
      condition,
      outdoorSpaces,
      parking,
      yearBuilt: parseInt(yearBuilt, 10),
      occupation,
      urgency,
      firstname,
      lastname,
      email,
      phone,
    };

    const promise = async () => {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erreur serveur");
      return res.json() as Promise<EstimateResult | null>;
    };

    toast.promise(promise(), {
      loading: "Estimation en cours...",
      success: (result) => {
        if (!result) throw new Error("Aucune estimation trouvée.");
        setStep(4);
        return `Prix estimé : ${result.estimatedPrice.toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        })}`;
      },
      error: (err: Error) => err.message || "Erreur lors de l'estimation",
    });
  };

  return (
    <Card className="relative duration-300 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Obtenir mon estimation
        </CardTitle>
      </CardHeader>
      <CardContent className="relative duration-300">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <>
              <p className="text-gray-700 mb-4">
                Remplissez ce formulaire pour recevoir une estimation gratuite
                de votre bien immobilier.
              </p>
              <AddressStep
                address={address}
                postcode={postcode}
                city={city}
                suggestions={suggestions}
                addressValid={addressValid}
                postcodeValid={postcodeValid}
                cityValid={cityValid}
                touched={touched}
                setAddress={setAddress}
                setPostcode={setPostcode}
                setCity={setCity}
                onAddressBlur={handleAddressBlur}
                setTouched={setTouched}
                onSuggestionClick={handleSuggestionClick}
                onNext={() => setStep(2)}
                isValid={isStep1Valid}
              />
            </>
          )}
          {step === 2 && (
            <PropertyStep
              surface={surface}
              propertyType={propertyType}
              rooms={rooms}
              condition={condition}
              outdoorSpaces={outdoorSpaces}
              parking={parking}
              yearBuilt={yearBuilt}
              occupation={occupation}
              urgency={urgency}
              surfaceValid={surfaceValid}
              propertyTypeValid={propertyTypeValid}
              roomsValid={roomsValid}
              conditionValid={conditionValid}
              yearBuiltValid={yearBuiltValid}
              touched={touched}
              setSurface={setSurface}
              setPropertyType={setPropertyType}
              setRooms={setRooms}
              setCondition={setCondition}
              setOutdoorSpaces={setOutdoorSpaces}
              setParking={setParking}
              setYearBuilt={setYearBuilt}
              setOccupation={setOccupation}
              setUrgency={setUrgency}
              setTouched={setTouched}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
              isValid={isStep2Valid}
            />
          )}
          {step === 3 && (
            <ContactStep
              firstname={firstname}
              lastname={lastname}
              email={email}
              phone={phone}
              consent={consent}
              firstnameValid={firstnameValid}
              lastnameValid={lastnameValid}
              emailValid={emailValid}
              phoneValid={phoneValid}
              touched={touched}
              setFirstname={setFirstname}
              setLastname={setLastname}
              setEmail={setEmail}
              setPhone={setPhone}
              setConsent={setConsent}
              setTouched={setTouched}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
              isValid={isStep3Valid}
            />
          )}

          {/* Step 4 : Finished */}
          {step === 4 && (
            <>
              <FinishStep
                onFinish={() => {
                  setStep(1);
                  setAddress("");
                  setPostcode("");
                  setCity("");
                  setSurface("");
                  setPropertyType("");
                  setRooms("");
                  setCondition("");
                  setOutdoorSpaces([]);
                  setParking("");
                  setYearBuilt("");
                  setOccupation("");
                  setUrgency("");
                  setFirstname("");
                  setLastname("");
                  setEmail("");
                  setPhone("");
                  setConsent(false);
                  setTouched({
                    address: false,
                    postcode: false,
                    city: false,
                    surface: false,
                    propertyType: false,
                    rooms: false,
                    firstname: false,
                    lastname: false,
                    email: false,
                    phone: false,
                    consent: false,
                  });
                }}
              />
            </>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
