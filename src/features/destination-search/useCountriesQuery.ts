import { useQuery } from "@tanstack/react-query";
import { loadCountries } from "./destinationService";
import { destinationKeys } from "./query-keys";

export function useCountriesQuery() {
  return useQuery({
    queryKey: destinationKeys.countries(),
    queryFn: loadCountries,
  });
}
