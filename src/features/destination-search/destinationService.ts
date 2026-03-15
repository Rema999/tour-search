import { getCountries, searchGeo } from "@/shared/api";
import type { CountriesResponse, GeoSearchResponse } from "./api-types";
import type { DestinationOption } from "./types";
import { mapCountriesToOptions, mapGeoToOptions } from "./mappers";

export async function loadCountries(): Promise<DestinationOption[]> {
  const raw = await getCountries() as unknown as CountriesResponse;
  return mapCountriesToOptions(raw);
}

export async function searchGeoDestinations(
  query: string
): Promise<DestinationOption[]> {
  const raw = await searchGeo(query) as unknown as GeoSearchResponse;
  return mapGeoToOptions(raw);
}
