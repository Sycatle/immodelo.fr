import { useEffect, useState } from "react";
import { splitAddress, ParsedAddress } from "./form-helpers";
import type { AddressFeature } from "@/components/forms/types";

interface UseAddressSuggestionsResult {
  suggestions: string[];
  selectSuggestion: (index: number) => ParsedAddress | null;
  clear: () => void;
}

/**
 * Provide autocomplete suggestions for a French address using the
 * api-adresse.data.gouv.fr service.
 */
export function useAddressSuggestions(address: string): UseAddressSuggestionsResult {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [features, setFeatures] = useState<AddressFeature[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (address.length < 3) {
        setFeatures([]);
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}&autocomplete=1&limit=3&type=housenumber`
        );
        if (!res.ok) {
          setFeatures([]);
          setSuggestions([]);
          return;
        }
        const data = await res.json();
        const feats = Array.isArray(data.features) ? (data.features as AddressFeature[]) : [];
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

  const selectSuggestion = (index: number): ParsedAddress | null => {
    const selected = features[index];
    if (!selected) return null;
    const props = selected.properties;
    const parsed = splitAddress(props.label);
    return {
      street: parsed.street,
      postcode: props.postcode || parsed.postcode,
      city: props.city || parsed.city,
    };
  };

  const clear = () => setSuggestions([]);

  return { suggestions, selectSuggestion, clear };
}
