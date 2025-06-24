"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

export function EstimationForm() {
	const [step, setStep] = useState(1);

	// Step 1 states
	const [address, setAddress] = useState("");
	const [postcode, setPostcode] = useState("");
	const [city, setCity] = useState("");
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [features, setFeatures] = useState<any[]>([]);

	// Step 2 states
	const [surface, setSurface] = useState("");
	const [propertyType, setPropertyType] = useState("");
	const [rooms, setRooms] = useState("");

	// Step 3 states
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [consent, setConsent] = useState(false);

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
	const isValidName = (name: string) => /^[a-zA-ZÀ-ÿ\s-]+$/.test(name.trim());
	const isValidEmail = (email: string) =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	const isValidPhone = (phone: string) =>
		/^((\+33|0)[1-9])(\d{2}){4}$/.test(phone.trim()); // Numéro FR

	// Validation checks for each step
	const isStep1Valid =
		isValidAddress(address) && isValidPostcode(postcode) && isValidCity(city);
	const isStep2Valid =
		isValidSurface(surface) &&
		isValidPropertyType(propertyType) &&
		isValidRooms(rooms);
	const isStep3Valid =
		isValidName(firstname) &&
		isValidName(lastname) &&
		isValidEmail(email) &&
		isValidPhone(phone) &&
		consent;

	useEffect(() => {
		const fetchSuggestions = async () => {
			if (address.length < 3) return;
			const res = await fetch(
				`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
					address,
				)}&autocomplete=1&limit=5` // Limite à 5 suggestions
			);
			const data = await res.json();
			setFeatures(data.features);
			setSuggestions(data.features.map((f: any) => f.properties.label));
		};

		const timeout = setTimeout(fetchSuggestions, 300);
		return () => clearTimeout(timeout);
	}, [address]);

	const handleSuggestionClick = (index: number) => {
		const selected = features[index];
		const props = selected.properties;
		setAddress(props.label);
		setPostcode(props.postcode || "");
		setCity(props.city || "");
		setSuggestions([]);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!consent) return alert("Merci de cocher la case de consentement.");

		const data = {
			address,
			postcode,
			city,
			surface,
			propertyType,
			rooms,
			firstname,
			lastname,
			email,
			phone,
		};

		console.log("Soumission complète", data);
		// TODO : envoyer à backend ou email
	};

	return (
		<Card className="relative shadow-lg duration-300 overflow-hidden">
			<motion.div
				className="absolute top-0 left-0 h-1 bg-orange-500"
				initial={{ width: 0 }}
				animate={{ width: `${(step / 3) * 100}%` }}
				exit={{ width: 0 }}
				transition={{ duration: 0.4, ease: "easeInOut" }}
			/>

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
								setStep(2);
							}}>
							<div>
								<Label
									className="p-1"
									htmlFor="address">
									Adresse
								</Label>
								<Input
									id="address"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									placeholder="12 rue de la paix"
									autoComplete="off"
									required
								/>
								{suggestions.length > 0 && (
									<ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow max-h-48 overflow-auto">
										{suggestions.map((s, idx) => (
											<li
												key={idx}
												className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
												onClick={() => handleSuggestionClick(idx)}>
												{s}
											</li>
										))}
									</ul>
								)}
							</div>
							<div className="flex gap-4">
								<div className="w-1/2">
									<Label
										className="p-1"
										htmlFor="postcode">
										Code postal
									</Label>
									<Input
										id="postcode"
										value={postcode}
										onChange={(e) => setPostcode(e.target.value)}
										placeholder="72000"
										required
									/>
								</div>
								<div className="w-1/2">
									<Label
										className="p-1"
										htmlFor="city">
										Ville
									</Label>
									<Input
										id="city"
										value={city}
										onChange={(e) => setCity(e.target.value)}
										placeholder="Le Mans"
										required
									/>
								</div>
							</div>

							<Button
								type="submit"
								disabled={!isStep1Valid}
								className="w-full bg-orange-500 hover:bg-orange-600 text-white">
								Étape suivante
							</Button>
						</motion.form>
					)}

					{step === 2 && (
						<motion.form
							key="step2"
							layout
							initial={{ x: 50, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: -50, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="space-y-4"
							onSubmit={handleSubmit}>
							<div>
								<Label
									className="p-1"
									htmlFor="propertyType">
									Type de bien
								</Label>
								<Select
									value={propertyType}
									onValueChange={setPropertyType}>
									<SelectTrigger>
										<SelectValue placeholder="Sélectionnez un type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="maison">Maison</SelectItem>
										<SelectItem value="appartement">Appartement</SelectItem>
										<SelectItem value="terrain">Terrain</SelectItem>
										<SelectItem value="autre">Autre</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label
									className="p-1"
									htmlFor="surface">
									Surface habitable (m²)
								</Label>
								<Input
									id="surface"
									type="number"
									value={surface}
									onChange={(e) => setSurface(e.target.value)}
									placeholder="90"
									required
								/>
							</div>

							<div>
								<Label
									className="p-1"
									htmlFor="rooms">
									Nombre de chambres
								</Label>
								<Input
									id="rooms"
									type="number"
									value={rooms}
									onChange={(e) => setRooms(e.target.value)}
									placeholder="ex : 3"
									required
								/>
							</div>

							<div className="flex justify-between gap-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => setStep(1)}
									className="w-1/2">
									Retour
								</Button>
								<Button
									type="button"
									onClick={() => setStep(3)}
									disabled={!isStep2Valid}
									className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white">
									Étape suivante
								</Button>
							</div>
						</motion.form>
					)}

					{step === 3 && (
						<motion.form
							key="step3"
							layout
							initial={{ x: 50, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: -50, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="space-y-4"
							onSubmit={handleSubmit}>
							<div className="flex gap-4">
								<div className="w-1/2">
									<Label
										className="p-1"
										htmlFor="firstname">
										Prénom
									</Label>
									<Input
										id="firstname"
										value={firstname}
										onChange={(e) => setFirstname(e.target.value)}
										placeholder="Jean"
										required
									/>
								</div>
								<div className="w-1/2">
									<Label
										className="p-1"
										htmlFor="lastname">
										Nom
									</Label>
									<Input
										id="lastname"
										value={lastname}
										onChange={(e) => setLastname(e.target.value)}
										placeholder="Dupont"
										required
									/>
								</div>
							</div>

							<div>
								<Label
									className="p-1"
									htmlFor="email">
									Email
								</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="jean.dupont@email.com"
									required
								/>
							</div>

							<div>
								<Label
									className="p-1"
									htmlFor="phone">
									Téléphone
								</Label>
								<Input
									id="phone"
									type="tel"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									placeholder="06 00 00 00 00"
									required
								/>
							</div>

							<div className="flex items-start gap-2">
								<input
									type="checkbox"
									id="consent"
									className="mt-1"
									checked={consent}
									onChange={(e) => setConsent(e.target.checked)}
									required
								/>
								<label
									htmlFor="consent"
									className="text-sm text-gray-700 leading-snug">
									J'autorise Immodelo à me contacter. <br />
									<span className="text-gray-500">
										Mes informations ne sont jamais transmises à des tiers.
									</span>
								</label>
							</div>

							<div className="flex justify-between gap-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => setStep(2)}
									className="w-1/2">
									Retour
								</Button>
								<Button
									type="submit"
									disabled={!isStep3Valid}
									className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white">
									Envoyer
								</Button>
							</div>
						</motion.form>
					)}
				</AnimatePresence>
			</CardContent>
		</Card>
	);
}
