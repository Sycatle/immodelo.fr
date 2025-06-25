import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

interface DVFEntry {
  code_postal: string;
  type_local: string;
  valeur_fonciere: string;
  surface_reelle_bati: string;
  nature_mutation?: string;
}

export interface EstimateInput {
  address: string;
  postcode: string;
  city: string;
  surface: number | string;
  propertyType: string;
  rooms: number;
  condition: string;
  outdoorSpaces: string[] | boolean;
  parking: string | boolean;
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

export async function POST(req: Request) {
  const data = (await req.json()) as EstimateInput;

  const targetSurface = parseFloat(String(data.surface));
  const propertyType = data.propertyType.trim().toLowerCase();
  const postcode = data.postcode.trim();

  if (isNaN(targetSurface)) {
    return NextResponse.json(null);
  }

  const filePath = path.join(process.cwd(), "data", "dvf_72.json");
  const fileContents = await fs.readFile(filePath, "utf-8");
  const dumps = JSON.parse(fileContents) as DVFEntry[];

  const similarSales = dumps
    .map((item) => {
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
    .filter(
      (x): x is { surface: number; price: number; pricePerM2: number } => x !== null
    );

  if (similarSales.length === 0) {
    return NextResponse.json(null);
  }

  const avgPricePerM2 =
    similarSales.reduce((acc, curr) => acc + curr.pricePerM2, 0) /
    similarSales.length;

  const estimatedPrice = Math.round(avgPricePerM2 * targetSurface);

  const result: EstimateResult = {
    estimatedPrice,
    similarSalesCount: similarSales.length,
    averagePricePerM2: Math.round(avgPricePerM2),
  };

  return NextResponse.json(result);
}

