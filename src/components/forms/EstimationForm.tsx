"use client";

// Multi-step estimation form handling property details and contact information.
// Validation and API calls are kept here while visual layout is split across
// smaller step components.

import { useState } from "react";
import StepLayout from "./StepLayout";
import { AnimatePresence } from "framer-motion";
import { AddressStep } from "./steps/AddressStep";
import { PropertyTypeStep } from "./steps/PropertyTypeStep";
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
  isValidPositiveInt,
  isValidName,
  isValidEmail,
  isValidPhone,
  splitAddress,
} from "@/lib/form-helpers";
import { geocodeAddress } from "@/lib/utils";
import { useAddressSuggestions } from "@/lib/useAddressSuggestions";
import FinishStep from "./steps/FinishStep";

const stepTitles = [
  "Étape 1 : Adresse du bien",
  "Étape 2 : À propos de ce bien",
  "Étape 3 : Caractéristiques du bien",
  "Étape 4 : Mes coordonnées",
];

interface EstimationFormProps {
  step: number;
  setStep: (step: number) => void;
  onAddressSelect?: (label: string, coords: [number, number]) => void;
}
export function EstimationForm({
  step,
  setStep,
  onAddressSelect,
}: EstimationFormProps) {
  // --- Step 1 : property address ---
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
        geocodeAddress(query).then((coords) => {
          if (coords) onAddressSelect(query, coords);
        });
      }
    }
  };

  // --- Step 2 : property details ---
  const [surface, setSurface] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [rooms, setRooms] = useState("");
  const [condition, setCondition] = useState("");
  const [totalSurface, setTotalSurface] = useState("");
  const [buildableSurface, setBuildableSurface] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [levels, setLevels] = useState("");
  const [outdoorSpaces, setOutdoorSpaces] = useState<string[]>([]);
  const [partyWalls, setPartyWalls] = useState(false);
  const [basement, setBasement] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [parkingSpots, setParkingSpots] = useState("");
  const [hasOutbuildings, setHasOutbuildings] = useState(false);
  const [outbuildings, setOutbuildings] = useState("");
  const [exceptionalView, setExceptionalView] = useState(false);
  const [pool, setPool] = useState(false);
  const [sewer, setSewer] = useState(false);
  const [dpe, setDpe] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [houseQuality, setHouseQuality] = useState("");
  const [brightness, setBrightness] = useState("");
  const [noise, setNoise] = useState("");
  const [transportProximity, setTransportProximity] = useState("");
  const [roofQuality, setRoofQuality] = useState("");
  const [occupation, setOccupation] = useState("");
  const [urgency, setUrgency] = useState("");

  // --- Step 3 : contact details ---
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

  /** Reset all fields to their initial state after the form is completed */
  const resetForm = () => {
    setStep(1);
    setAddress("");
    setPostcode("");
    setCity("");
    setSurface("");
    setPropertyType("");
    setRooms("");
    setCondition("");
    setOutdoorSpaces([]);
    setTotalSurface("");
    setBuildableSurface("");
    setBathrooms("");
    setLevels("");
    setPartyWalls(false);
    setBasement(false);
    setHasParking(false);
    setParkingSpots("");
    setHasOutbuildings(false);
    setOutbuildings("");
    setExceptionalView(false);
    setPool(false);
    setSewer(false);
    setDpe("");
    setYearBuilt("");
    setHouseQuality("");
    setBrightness("");
    setNoise("");
    setTransportProximity("");
    setRoofQuality("");
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
  };

  // Validations using helper utilities

  const addressValid = isValidAddress(address);
  const postcodeValid = isValidPostcode(postcode);
  const cityValid = isValidCity(city);
  const surfaceValid = isValidSurface(surface);
  const propertyTypeValid = isValidPropertyType(propertyType);
  const roomsValid = isValidRooms(rooms);
  const conditionValid = isValidCondition(condition);
  const yearBuiltValid = isValidYearBuilt(yearBuilt);
  const totalSurfaceValid = isValidPositiveInt(totalSurface);
  const buildableSurfaceValid = isValidPositiveInt(buildableSurface);
  const bathroomsValid = isValidPositiveInt(bathrooms);
  const levelsValid = isValidPositiveInt(levels);
  const parkingSpotsValid = !hasParking || isValidPositiveInt(parkingSpots);
  const outbuildingsValid = !hasOutbuildings || isValidPositiveInt(outbuildings);
  const dpeValid = dpe.trim().length > 0;
  const houseQualityValid = houseQuality.trim().length > 0;
  const brightnessValid = brightness.trim().length > 0;
  const noiseValid = noise.trim().length > 0;
  const transportProximityValid = transportProximity.trim().length > 0;
  const roofQualityValid = roofQuality.trim().length > 0;
  const occupationValid = occupation.trim().length > 0;
  const urgencyValid = urgency.trim().length > 0;
  const firstnameValid = isValidName(firstname);
  const lastnameValid = isValidName(lastname);
  const emailValid = isValidEmail(email);
  const phoneValid = isValidPhone(phone);

  // Validation checks for each step
  const isStep1Valid = addressValid && postcodeValid && cityValid;
  const isStep2Valid = propertyTypeValid;
  const isStep3Valid =
    surfaceValid &&
    totalSurfaceValid &&
    buildableSurfaceValid &&
    roomsValid &&
    bathroomsValid &&
    levelsValid &&
    conditionValid &&
    parkingSpotsValid &&
    outbuildingsValid &&
    dpeValid &&
    yearBuiltValid &&
    houseQualityValid &&
    brightnessValid &&
    noiseValid &&
    transportProximityValid &&
    roofQualityValid &&
    occupationValid &&
    urgencyValid;
  const isStep4Valid =
    firstnameValid && lastnameValid && emailValid && phoneValid && consent;

  const handleSuggestionClick = (index: number) => {
    const parsed = selectSuggestion(index);
    if (!parsed) return;
    setAddress(parsed.street);
    setPostcode(parsed.postcode);
    setCity(parsed.city);
    clear();
    if (parsed.lat && parsed.lon && onAddressSelect) {
      onAddressSelect(`${parsed.street}, ${parsed.postcode} ${parsed.city}`, [
        parsed.lat,
        parsed.lon,
      ]);
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
      totalSurface: totalSurface ? parseInt(totalSurface, 10) : undefined,
      buildableSurface: buildableSurface
        ? parseInt(buildableSurface, 10)
        : undefined,
      propertyType,
      rooms: parseInt(rooms, 10),
      bathrooms: bathrooms ? parseInt(bathrooms, 10) : undefined,
      levels: levels ? parseInt(levels, 10) : undefined,
      condition,
      outdoorSpaces,
      partyWalls,
      basement,
      parkingSpots: hasParking ? parseInt(parkingSpots || "0", 10) : undefined,
      outbuildings: hasOutbuildings
        ? parseInt(outbuildings || "0", 10)
        : undefined,
      exceptionalView,
      pool,
      sewer,
      dpe,
      yearBuilt: parseInt(yearBuilt, 10),
      houseQuality,
      brightness,
      noise,
      transportProximity,
      roofQuality,
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
        setStep(5);
        return `Prix estimé : ${result.estimatedPrice.toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        })}`;
      },
      error: (err: Error) => err.message || "Erreur lors de l'estimation",
    });
  };

  return (
    <AnimatePresence mode="wait">
      {step === 1 && (
        <StepLayout
          title={stepTitles[0]}
          formId="step1"
          nextDisabled={!isStep1Valid}
        >
          <p className="text-gray-700 mb-4">
            Remplissez ce formulaire pour recevoir une estimation gratuite de
            votre bien immobilier.
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
            formId="step1"
          />
        </StepLayout>
      )}
      {step === 2 && (
        <StepLayout
          title={stepTitles[1]}
          formId="step2"
          onBack={() => setStep(1)}
          nextDisabled={!isStep2Valid}
        >
          <PropertyTypeStep
            propertyType={propertyType}
            propertyTypeValid={propertyTypeValid}
            touched={touched}
            setPropertyType={setPropertyType}
            setTouched={setTouched}
            onNext={() => setStep(3)}
            isValid={isStep2Valid}
            formId="step2"
          />
        </StepLayout>
      )}
      {step === 3 && (
        <StepLayout
          title={stepTitles[2]}
          formId="step3"
          onBack={() => setStep(2)}
          nextDisabled={!isStep3Valid}
        >
          <PropertyStep
            surface={surface}
            rooms={rooms}
            condition={condition}
            totalSurface={totalSurface}
            buildableSurface={buildableSurface}
            outdoorSpaces={outdoorSpaces}
            partyWalls={partyWalls}
            basement={basement}
            hasParking={hasParking}
            parkingSpots={parkingSpots}
            hasOutbuildings={hasOutbuildings}
            outbuildings={outbuildings}
            exceptionalView={exceptionalView}
            bathrooms={bathrooms}
            levels={levels}
            isValid={isStep3Valid}
            pool={pool}
            sewer={sewer}
            dpe={dpe}
            yearBuilt={yearBuilt}
            houseQuality={houseQuality}
            brightness={brightness}
            noise={noise}
            transportProximity={transportProximity}
            roofQuality={roofQuality}
            occupation={occupation}
            urgency={urgency}
            surfaceValid={surfaceValid}
            roomsValid={roomsValid}
            conditionValid={conditionValid}
            yearBuiltValid={yearBuiltValid}
            touched={touched}
            setSurface={setSurface}
            setTotalSurface={setTotalSurface}
            setBuildableSurface={setBuildableSurface}
            setRooms={setRooms}
            setBathrooms={setBathrooms}
            setLevels={setLevels}
            setCondition={setCondition}
            setOutdoorSpaces={setOutdoorSpaces}
            setPartyWalls={setPartyWalls}
            setBasement={setBasement}
            setHasParking={setHasParking}
            setParkingSpots={setParkingSpots}
            setHasOutbuildings={setHasOutbuildings}
            setOutbuildings={setOutbuildings}
            setExceptionalView={setExceptionalView}
            setPool={setPool}
            setSewer={setSewer}
            setDpe={setDpe}
            setYearBuilt={setYearBuilt}
            setHouseQuality={setHouseQuality}
            setBrightness={setBrightness}
            setNoise={setNoise}
            setTransportProximity={setTransportProximity}
            setRoofQuality={setRoofQuality}
            setOccupation={setOccupation}
            setUrgency={setUrgency}
            setTouched={setTouched}
            onNext={() => setStep(4)}
            formId="step3"
          />
        </StepLayout>
      )}
      {step === 4 && (
        <StepLayout
          title={stepTitles[3]}
          formId="step4"
          onBack={() => setStep(3)}
          nextDisabled={!isStep4Valid}
        >
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
            onSubmit={handleSubmit}
            formId="step4"
          />
        </StepLayout>
      )}

      {/* Step 5 : Finished */}
      {step === 5 && (
        <>
          <FinishStep
            onFinish={resetForm}
          />
        </>
      )}
    </AnimatePresence>
  );
}
