export interface ParsedAddress {
  street: string;
  postcode: string;
  city: string;
}

/**
 * Split a full address string into street, postcode and city parts.
 * Returns empty strings for missing segments.
 */
export function splitAddress(value: string): ParsedAddress {
  const regex = /^(.*?)(\d{5})\s+(.+)$/;
  const match = value.trim().match(regex);
  if (match) {
    const [, street, pc, ct] = match;
    return { street: street.trim(), postcode: pc, city: ct.trim() };
  }
  return { street: value.trim(), postcode: "", city: "" };
}

// Basic regex based validators used by the multi-step form
export const isValidAddress = (address: string): boolean =>
  /^[a-zA-Z0-9À-ÿ\s,.'-]+$/.test(address.trim()) && address.trim().length > 3;

export const isValidPostcode = (postcode: string): boolean => /^\d{5}$/.test(postcode);

export const isValidCity = (city: string): boolean =>
  /^[a-zA-ZÀ-ÿ\s-]+$/.test(city.trim()) && city.trim().length > 2;

export const isValidSurface = (surface: string): boolean =>
  /^\d+$/.test(surface) && Number(surface) > 5;

export const isValidPropertyType = (type: string): boolean =>
  ["maison", "appartement", "terrain", "autre"].includes(type);

export const isValidRooms = (rooms: string): boolean =>
  /^\d+$/.test(rooms) && Number(rooms) >= 0;

export const isValidCondition = (c: string): boolean => c.trim().length > 0;

export const isValidYearBuilt = (y: string): boolean =>
  y === "" || /^\d{4}$/.test(y.trim());

export const isValidName = (name: string): boolean => /^[a-zA-ZÀ-ÿ\s-]+$/.test(name.trim());

export const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone: string): boolean =>
  /^((\+33|0)[1-9])(\d{2}){4}$/.test(phone.trim());
