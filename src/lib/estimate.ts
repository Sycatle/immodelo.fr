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
  propertyType: string;
  rooms: number;
  condition: string;
  outdoorSpaces: string[]; // à la place de boolean
  parking: string; // à la place de boolean
  yearBuilt: number;
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

export default function estimatePrice(data: EstimateInput): EstimateResult | null {
  const targetSurface = parseFloat(String(data.surface));
  const propertyType = data.propertyType.trim().toLowerCase();
  const postcode = data.postcode.trim();

  if (isNaN(targetSurface)) return null;

  const similarSales = typedDumps.map((item) => {
      const surface = parseFloat(item.surface_reelle_bati?.replace(",", "."));
      const price = parseFloat(item.valeur_fonciere?.replace(",", "."));

      if (
        item.nature_mutation?.toLowerCase() === "vente" &&
        item.code_postal === postcode &&
        item.type_local?.toLowerCase() === propertyType &&
        !isNaN(surface) &&
        !isNaN(price) &&
        surface >= targetSurface * 0.8 &&
        surface <= targetSurface * 1.2 &&
        price > 10000
      ) {
        return {
          surface,
          price,
          pricePerM2: price / surface,
        };
      }

      return null;
    })
    .filter((x): x is { surface: number; price: number; pricePerM2: number } => x !== null);

  if (similarSales.length === 0) return null;

  const avgPricePerM2 =
    similarSales.reduce((acc, curr) => acc + curr.pricePerM2, 0) / similarSales.length;

  const estimatedPrice = Math.round(avgPricePerM2 * targetSurface);

  return {
    estimatedPrice,
    similarSalesCount: similarSales.length,
    averagePricePerM2: Math.round(avgPricePerM2),
  };
}
