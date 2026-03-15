export type CountryRaw = {
  id: string;
  name: string;
  flag: string;
};

export type GeoEntityRaw = {
  id: string | number;
  name: string;
  type: string;
  countryId?: string;
};

export type CountriesResponse = Record<string, CountryRaw>;
export type GeoSearchResponse = Record<string, GeoEntityRaw>;
