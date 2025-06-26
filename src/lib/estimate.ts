// src/lib/estimate.ts
import dumps from "../../data/dvf_72.json" assert { type: "json" };

// Défini le type de dump
type DVFEntry = {
  code_postal: string;
  type_local: string;
  valeur_fonciere: string;
  surface_reelle_bati: string;
  nature_mutation?: string;
};

// Force le typage du JSON
const typedDumps = dumps as DVFEntry[];

export interface EstimateInput {
  address: string;
  postcode: string;
  city: string;
  surface: number | string;
  totalSurface?: number;
  buildableSurface?: number;
  propertyType: string;
  rooms: number;
  bathrooms?: number;
  levels?: number;
  condition: string;
  partyWalls?: boolean;
  basement?: boolean;
  parkingSpots?: number;
  outbuildings?: number;
  exceptionalView?: boolean;
  pool?: boolean;
  sewer?: boolean;
  outdoorSpaces: string[]; // à la place de boolean
  dpe?: string;
  yearBuilt: number;
  houseQuality?: string;
  brightness?: string;
  noise?: string;
  transportProximity?: string;
  roofQuality?: string;
  occupation: string;
  urgency: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export interface EstimateResult {
  estimatedPrice: number;
  similarSalesCount: number;
  averagePricePerM2: number;
}

export default function estimatePrice(
  data: EstimateInput
): EstimateResult | null {
  const targetSurface = parseFloat(String(data.surface));
  const propertyType = data.propertyType.trim().toLowerCase();
  const postcode = data.postcode.trim();

  if (isNaN(targetSurface)) return null;

  let totalPricePerM2 = 0;
  let count = 0;

  for (const item of typedDumps) {
    if (
      item.nature_mutation?.toLowerCase() === "vente" &&
      item.code_postal === postcode &&
      item.type_local?.toLowerCase() === propertyType
    ) {
      const surface = parseFloat(item.surface_reelle_bati?.replace(",", "."));
      const price = parseFloat(item.valeur_fonciere?.replace(",", "."));

      if (
        !isNaN(surface) &&
        !isNaN(price) &&
        surface >= targetSurface * 0.8 &&
        surface <= targetSurface * 1.2 &&
        price > 10000
      ) {
        totalPricePerM2 += price / surface;
        count += 1;
      }
    }
  }

  if (count === 0) return null;

  const avgPricePerM2 = totalPricePerM2 / count;
  let estimatedPrice = avgPricePerM2 * targetSurface;

  let modifier = 0;
  switch (data.condition) {
    case "Comme neuf":
      modifier += 0.05;
      break;
    case "Quelques travaux":
      modifier -= 0.1;
      break;
    case "Travaux importants":
      modifier -= 0.2;
      break;
  }

  if (data.pool) modifier += 0.05;
  if (data.exceptionalView) modifier += 0.05;
  if (data.partyWalls) modifier -= 0.02;
  if (data.basement) estimatedPrice += 5000;
  if (data.parkingSpots) estimatedPrice += data.parkingSpots * 8000;
  if (data.outbuildings) estimatedPrice += data.outbuildings * 5000;
  if (!data.sewer) modifier -= 0.02;

  switch (data.houseQuality) {
    case "Supérieure":
      modifier += 0.05;
      break;
    case "Inférieure":
      modifier -= 0.05;
      break;
  }

  switch (data.brightness) {
    case "Très clair":
      modifier += 0.03;
      break;
    case "Clair":
      modifier += 0.02;
      break;
    case "Peu clair":
      modifier -= 0.02;
      break;
    case "Sombre":
      modifier -= 0.05;
      break;
  }

  switch (data.noise) {
    case "Très calme":
      modifier += 0.03;
      break;
    case "Calme":
      modifier += 0.02;
      break;
    case "Bruit":
    case "Bruyant":
      modifier -= 0.02;
      break;
    case "Très bruyant":
      modifier -= 0.05;
      break;
  }

  switch (data.transportProximity) {
    case "Très proche":
      modifier += 0.03;
      break;
    case "Proche":
      modifier += 0.02;
      break;
    case "Éloigné":
      modifier -= 0.02;
      break;
    case "Très éloigné":
      modifier -= 0.05;
      break;
  }

  switch (data.roofQuality) {
    case "Refaite à neuf":
      modifier += 0.03;
      break;
    case "À rénover":
      modifier -= 0.05;
      break;
  }

  estimatedPrice = estimatedPrice * (1 + modifier);

  if (data.buildableSurface)
    estimatedPrice += data.buildableSurface * avgPricePerM2 * 0.3;
  if (data.totalSurface && data.totalSurface > targetSurface)
    estimatedPrice += (data.totalSurface - targetSurface) * avgPricePerM2 * 0.1;

  estimatedPrice = Math.round(estimatedPrice);

  return {
    estimatedPrice,
    similarSalesCount: count,
    averagePricePerM2: Math.round(avgPricePerM2),
  };
}
