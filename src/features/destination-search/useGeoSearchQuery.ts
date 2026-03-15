import { useQuery } from "@tanstack/react-query";
import { searchGeoDestinations } from "./destinationService";
import { destinationKeys } from "./query-keys";

export function useGeoSearchQuery(query: string) {
  return useQuery({
    queryKey: destinationKeys.geoSearch(query),
    queryFn: () => searchGeoDestinations(query),
    enabled: query.trim().length > 0,
  });
}
