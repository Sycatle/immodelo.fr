"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence } from "framer-motion";
import { ProgressBar } from "./ProgressBar";
import { AddressStep } from "./steps/AddressStep";
import { PropertyStep } from "./steps/PropertyStep";
import { ContactStep } from "./steps/ContactStep";
import type { Touched, AddressFeature } from "./types";
import type { EstimateInput, EstimateResult } from "@/lib/estimate";
import { toast } from "sonner";

export function EstimationForm() {
  const [step, setStep] = useState(1);

  // Step 1 states
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [features, setFeatures] = useState<AddressFeature[]>([]);

  const splitAddress = (
    value: string
  ): { street: string; postcode: string; city: string } => {
    const regex = /^(.*?)(\d{5})\s+(.+)$/;
    const match = value.trim().match(regex);
    if (match) {
      const [, street, pc, ct] = match;
      return { street: street.trim(), postcode: pc, city: ct.trim() };
    }
    return { street: value.trim(), postcode: "", city: "" };
  };

  const handleAddressBlur = () => {
    const parsed = splitAddress(address);
    setAddress(parsed.street);
    if (parsed.postcode) setPostcode(parsed.postcode);
    if (parsed.city) setCity(parsed.city);
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

  // Regex validation functions
  const isValidAddress = (address: string) =>
    /^[a-zA-Z0-9À-ÿ\s,.'-]+$/.test(address.trim()) && address.trim().length > 3;
  const isValidPostcode = (postcode: string) => /^\d{5}$/.test(postcode);
  const isValidCity = (city: string) =>
    /^[a-zA-ZÀ-ÿ\s-]+$/.test(city.trim()) && city.trim().length > 2;
  const isValidSurface = (surface: string) =>
    /^\d+$/.test(surface) && Number(surface) > 5;
  const isValidPropertyType = (type: string) =>
    ["maison", "appartement", "terrain", "autre"].includes(type);
  const isValidRooms = (rooms: string) =>
    /^\d+$/.test(rooms) && Number(rooms) >= 0;
  const isValidCondition = (c: string) => c.trim().length > 0;
  const isValidYearBuilt = (y: string) => y === "" || /^\d{4}$/.test(y.trim());
  const isValidName = (name: string) => /^[a-zA-ZÀ-ÿ\s-]+$/.test(name.trim());
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) =>
    /^((\+33|0)[1-9])(\d{2}){4}$/.test(phone.trim()); // Numéro FR

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

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (address.length < 3) return;
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
            address
          )}&autocomplete=1&limit=5` // Limite à 5 suggestions
        );
        if (!res.ok) {
          setFeatures([]);
          setSuggestions([]);
          return;
        }
        const data = await res.json();
        const feats = Array.isArray(data.features)
          ? (data.features as AddressFeature[])
          : [];
        setFeatures(feats);
        setSuggestions(feats.map((f) => f.properties.label));
      } catch {
        setFeatures([]);
        setSuggestions([]);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [address]);

  const handleSuggestionClick = (index: number) => {
    const selected = features[index];
    const props = selected.properties;
    const parsed = splitAddress(props.label);
    setAddress(parsed.street);
    setPostcode(props.postcode || parsed.postcode);
    setCity(props.city || parsed.city);
    setSuggestions([]);
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
        setStep(1);
        return `Prix estimé : ${result.estimatedPrice.toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        })}`;
      },
      error: (err: Error) => err.message || "Erreur lors de l'estimation",
    });
  };

  return (
    <Card className="relative shadow-lg duration-300 overflow-hidden">
      <ProgressBar step={step} />
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Obtenir mon estimation
        </CardTitle>
      </CardHeader>
      <CardContent className="relative duration-300">
        <p className="text-gray-700 mb-4">
          Remplissez ce formulaire pour recevoir une estimation gratuite de
          votre bien immobilier.
        </p>
        <AnimatePresence mode="wait">
          {step === 1 && (
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
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
