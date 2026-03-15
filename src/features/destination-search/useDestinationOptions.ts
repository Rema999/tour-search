import { useMemo } from "react";
import { useCountriesQuery } from "./useCountriesQuery";
import { useGeoSearchQuery } from "./useGeoSearchQuery";
import type { DestinationOption } from "./types";

export function useDestinationOptions(
  inputValue: string,
  selectedValue: DestinationOption | null
): { options: DestinationOption[]; isPending: boolean } {
  const showCountries =
    inputValue === "" ||
    (selectedValue?.type === "country" && inputValue === selectedValue.label);

  const countriesQuery = useCountriesQuery();
  const geoQuery = useGeoSearchQuery(inputValue);

  return useMemo(() => {
    if (showCountries) {
      return {
        options: countriesQuery.data ?? [],
        isPending: countriesQuery.isPending,
      };
    }
    return {
      options: geoQuery.data ?? [],
      isPending: geoQuery.isPending,
    };
  }, [
    showCountries,
    countriesQuery.data,
    countriesQuery.isPending,
    geoQuery.data,
    geoQuery.isPending,
  ]);
}
