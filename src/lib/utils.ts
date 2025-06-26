import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Fetch GPS coordinates for a given address using the French national
 * geocoding API. Returns `null` if the lookup fails.
 */
export async function geocodeAddress(
  query: string
): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
        query
      )}&limit=1`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const feature = data?.features?.[0];
    if (!feature) return null;
    return [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
  } catch {
    return null;
  }
}
