// src/lib/estimate.ts
import dumps from "../../data/dvf_72.json" assert { type: "json" };

type DVFEntry = {
  code_postal: string;
  commune: string;
  type_local: string;
  valeur_fonciere: string;
  surface_reelle_bati: string;
  nature_mutation?: string;
};

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
  dpe?: string;
  yearBuilt?: number;
  houseQuality?: string;
  brightness?: string;
  noise?: string;
  transportProximity?: string;
  roofQuality?: string;
  occupation?: string;
  urgency?: string;
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

function getMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function stdDev(arr: number[]): number {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const squareDiffs = arr.map((v) => (v - mean) ** 2);
  return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / arr.length);
}

/**
 * Normalize les noms de communes pour comparaison:
 * - Supprime les accents
 * - Remplace tirets et apostrophes par des espaces
 * - Met en minuscules
 * - Transforme "st" en "saint", "ste" en "sainte"
 */
function normalizeCommune(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[-'’]/g, " ")
    .toLowerCase()
    .split(/\s+/)
    .map((word) => {
      if (word === "st") return "saint";
      if (word === "ste") return "sainte";
      return word;
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

export default function estimatePrice(
  data: EstimateInput
): EstimateResult | null {
  const targetSurface = parseFloat(String(data.surface));
  if (isNaN(targetSurface) || targetSurface < 15) return null;

  const propertyType = data.propertyType.trim().toLowerCase();
  const normalizedTargetCity = normalizeCommune(data.city);
  const postcode = data.postcode.trim();

  // Étape 1 — ventes dans la même commune, même type
  const relevantSales = typedDumps
    .map((item) => {
      const surface = parseFloat(item.surface_reelle_bati?.replace(",", "."));
      const price = parseFloat(item.valeur_fonciere?.replace(",", "."));
      const cityItem = normalizeCommune(item.commune ?? "");
      if (
        item.nature_mutation?.toLowerCase() === "vente" &&
        cityItem === normalizedTargetCity &&
        item.code_postal === postcode &&
        item.type_local?.toLowerCase() === propertyType &&
        !isNaN(surface) &&
        !isNaN(price) &&
        surface > 10 &&
        price > 10000
      ) {
        return { surface, price, pricePerM2: price / surface };
      }
      return null;
    })
    .filter(Boolean) as {
    surface: number;
    price: number;
    pricePerM2: number;
  }[];

  if (relevantSales.length < 5) return null;

  // Étape 2 — exclure les outliers
  const pricesM2 = relevantSales.map((s) => s.pricePerM2);
  const median = getMedian(pricesM2);
  const deviation = stdDev(pricesM2);
  const filtered = relevantSales.filter(
    (s) => Math.abs(s.pricePerM2 - median) < deviation * 1.5
  );

  if (filtered.length < 3) return null;

  // Calcul du prix médian au m² final
  const finalMedianM2 = getMedian(filtered.map((s) => s.pricePerM2));
  let estimatedPrice = finalMedianM2 * targetSurface;

  // Étape 3 — pondérations légères
  let modifier = 0;
  switch (data.condition) {
    case "Comme neuf":
      modifier += 0.01;
      break;
    case "Travaux importants":
      modifier -= 0.03;
      break;
  }
  if (data.pool) modifier += 0.01;
  if (!data.sewer) modifier -= 0.01;
  if (data.brightness === "Très clair") modifier += 0.01;
  if (data.noise === "Très bruyant") modifier -= 0.02;
  modifier = Math.max(-0.05, Math.min(0.05, modifier));
  estimatedPrice *= 1 + modifier;

  // Étape 4 — bonus fixes minimes
  if (data.parkingSpots)
    estimatedPrice += Math.min(data.parkingSpots, 2) * 4000;
  if (data.outbuildings)
    estimatedPrice += Math.min(data.outbuildings, 2) * 3000;

  // Étape 5 — bonus surface de terrain
  if (data.totalSurface && data.totalSurface > targetSurface) {
    const bonus = (data.totalSurface - targetSurface) * finalMedianM2 * 0.03;
    estimatedPrice += bonus;
  }

  // Étape 6 — retrait des frais agence/notaire (7%)
  estimatedPrice *= 0.93;

  return {
    estimatedPrice: Math.round(estimatedPrice),
    similarSalesCount: filtered.length,
    averagePricePerM2: Math.round(finalMedianM2),
  };
}
