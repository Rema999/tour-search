export const destinationKeys = {
  all: ["destinations"] as const,
  countries: () => [...destinationKeys.all, "countries"] as const,
  geoSearch: (query: string) => [...destinationKeys.all, "geo", query] as const,
};
