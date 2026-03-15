import type { DestinationOption } from "./types";
import type { CountriesResponse, GeoSearchResponse } from "./api-types";

export function mapCountriesToOptions(record: CountriesResponse): DestinationOption[] {
  return Object.values(record).map((c) => ({
    id: c.id,
    label: c.name,
    type: "country" as const,
    countryId: c.id,
  }));
}

export function mapGeoToOptions(record: GeoSearchResponse): DestinationOption[] {
  return Object.values(record).map((entity) => {
    const id = String(entity.id);
    const countryId =
      entity.type === "country" ? id : (entity.countryId ?? "");
    const type =
      entity.type === "city" || entity.type === "hotel"
        ? entity.type
        : "country";
    return {
      id,
      label: entity.name,
      type,
      countryId,
    };
  });
}
