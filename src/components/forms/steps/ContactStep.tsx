"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Touched } from "../types";

interface ContactStepProps {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  consent: boolean;
  firstnameValid: boolean;
  lastnameValid: boolean;
  emailValid: boolean;
  phoneValid: boolean;
  touched: Touched;
  setFirstname: (v: string) => void;
  setLastname: (v: string) => void;
  setEmail: (v: string) => void;
  setPhone: (v: string) => void;
  setConsent: (v: boolean) => void;
  setTouched: React.Dispatch<React.SetStateAction<Touched>>;
  onSubmit: (e: React.FormEvent) => void;
  formId: string;
}

export function ContactStep({
  firstname,
  lastname,
  email,
  phone,
  consent,
  firstnameValid,
  lastnameValid,
  emailValid,
  phoneValid,
  touched,
  setFirstname,
  setLastname,
  setEmail,
  setPhone,
  setConsent,
  setTouched,
  onSubmit,
  formId,
}: ContactStepProps) {
  return (
    <motion.form
      id={formId}
      key="step3"
      layout
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      onSubmit={onSubmit}
    >
      <div className="flex gap-4">
        <div className="w-1/2">
          <Label className="p-1" htmlFor="firstname">
            Prénom
          </Label>
          <Input
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            onBlur={() => setTouched({ ...touched, firstname: true })}
            placeholder="Jean"
            autoComplete="given-name"
            aria-invalid={touched.firstname && !firstnameValid}
            aria-describedby={
              touched.firstname && !firstnameValid
                ? "firstname-error"
                : undefined
            }
            className={cn(
              touched.firstname && !firstnameValid && "border-red-500"
            )}
            required
          />
          {touched.firstname && !firstnameValid && (
            <p
              id="firstname-error"
              role="alert"
              className="text-sm text-red-500 mt-1"
            >
              Prénom invalide
            </p>
          )}
        </div>
        <div className="w-1/2">
          <Label className="p-1" htmlFor="lastname">
            Nom
          </Label>
          <Input
            id="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            onBlur={() => setTouched({ ...touched, lastname: true })}
            placeholder="Dupont"
            autoComplete="family-name"
            aria-invalid={touched.lastname && !lastnameValid}
            aria-describedby={
              touched.lastname && !lastnameValid ? "lastname-error" : undefined
            }
            className={cn(
              touched.lastname && !lastnameValid && "border-red-500"
            )}
            required
          />
          {touched.lastname && !lastnameValid && (
            <p
              id="lastname-error"
              role="alert"
              className="text-sm text-red-500 mt-1"
            >
              Nom invalide
            </p>
          )}
        </div>
      </div>
      <div>
        <Label className="p-1" htmlFor="email">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched({ ...touched, email: true })}
          placeholder="jean.dupont@email.com"
          autoComplete="email"
          aria-invalid={touched.email && !emailValid}
          aria-describedby={
            touched.email && !emailValid ? "email-error" : undefined
          }
          className={cn(touched.email && !emailValid && "border-red-500")}
          required
        />
        {touched.email && !emailValid && (
          <p
            id="email-error"
            role="alert"
            className="text-sm text-red-500 mt-1"
          >
            Email invalide
          </p>
        )}
      </div>
      <div>
        <Label className="p-1" htmlFor="phone">
          Téléphone
        </Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => setTouched({ ...touched, phone: true })}
          placeholder="06 00 00 00 00"
          autoComplete="tel"
          aria-invalid={touched.phone && !phoneValid}
          aria-describedby={
            touched.phone && !phoneValid ? "phone-error" : undefined
          }
          className={cn(touched.phone && !phoneValid && "border-red-500")}
          required
        />
        {touched.phone && !phoneValid && (
          <p
            id="phone-error"
            role="alert"
            className="text-sm text-red-500 mt-1"
          >
            Téléphone invalide
          </p>
        )}
      </div>
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="consent"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setTouched({ ...touched, consent: true });
          }}
          aria-invalid={touched.consent && !consent}
          aria-describedby={
            touched.consent && !consent ? "consent-error" : undefined
          }
          className={cn(
            "mt-1",
            touched.consent && !consent && "border-red-500"
          )}
          required
        />
        <label htmlFor="consent" className="text-sm text-gray-700 leading-snug">
          J&apos;autorise Immodelo à me contacter. <br />
          <span className="text-gray-500">
            Mes informations ne sont jamais transmises à des tiers.
          </span>
        </label>
        {touched.consent && !consent && (
          <p
            id="consent-error"
            role="alert"
            className="text-sm text-red-500 mt-1"
          >
            Consentement requis
          </p>
        )}
      </div>
    </motion.form>
  );
}
