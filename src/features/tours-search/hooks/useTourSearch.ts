import { useState, useCallback, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DestinationOption } from "@/features/destination-search";
import {
  getCountryIdFromDestination,
  runToursSearchByCountryId,
} from "../searchToursService";
import { stopSearchPrices } from "@/shared/api";
import { filterToursByDestination } from "../services/filterToursByDestination";
import type { TourCardViewModel } from "../services/toursAggregator";
import { isSearchCancelledError } from "../searchTours.types";
import { QUERY_KEYS } from "../query-keys";

const STALE_TIME_MS = 10 * 60 * 1000;

const INVALID_DESTINATION_MESSAGE = "Оберіть напрямок для пошуку";

export type UseTourSearchResult = {
  search: (destination: DestinationOption | null) => void;
  tours: TourCardViewModel[];
  loading: boolean;
  error: Error | null;
  hasSearched: boolean;
  loadingForCountryId: string | null;
};

type MutationPayload = {
  countryId: string;
  destination: DestinationOption;
  signal?: AbortSignal;
  tokenRef?: React.MutableRefObject<string | null>;
};

function isCountryId(key: unknown): key is string {
  return typeof key === "string" && key.length > 0;
}

function toError(e: unknown): Error {
  return e instanceof Error ? e : new Error(String(e));
}

export function useTourSearch(): UseTourSearchResult {
  const queryClient = useQueryClient();
  const tokenRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [destinationForResultsFilter, setDestinationForResultsFilter] =
    useState<DestinationOption | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: ({
      countryId,
      signal,
      tokenRef: tr,
    }: MutationPayload) =>
      runToursSearchByCountryId(countryId, {
        signal,
        onToken: tr ? (t) => (tr.current = t) : undefined,
      }),
    onSuccess: (data, { countryId, destination }) => {
      queryClient.setQueryData<TourCardViewModel[]>(
        [QUERY_KEYS.TOURS_SEARCH, countryId],
        data
      );
      setDestinationForResultsFilter(destination);
    },
  });

  const countryIdForQuery = getCountryIdFromDestination(destinationForResultsFilter);

  const {
    data: cachedTours = [],
    isLoading: queryLoading,
    error: queryError,
  } = useQuery({
    queryKey: [QUERY_KEYS.TOURS_SEARCH, countryIdForQuery],
    queryFn: ({ queryKey }) => {
      const id = queryKey[1];
      if (!isCountryId(id)) throw new Error("Invalid query key");
      return runToursSearchByCountryId(id);
    },
    enabled: !!countryIdForQuery,
    staleTime: STALE_TIME_MS,
  });

  const tours = useMemo(
    () => filterToursByDestination(cachedTours, destinationForResultsFilter),
    [cachedTours, destinationForResultsFilter]
  );

  const search = useCallback(
    (destination: DestinationOption | null) => {
      setValidationMessage(null);
      const countryId = getCountryIdFromDestination(destination);

      if (!countryId) {
        setValidationMessage(INVALID_DESTINATION_MESSAGE);
        return;
      }

      const cached = queryClient.getQueryData<TourCardViewModel[]>([
        QUERY_KEYS.TOURS_SEARCH,
        countryId,
      ]);
      if (cached !== undefined && destination) {
        setDestinationForResultsFilter(destination);
        return;
      }

      if (!destination) return;

      if (abortRef.current) {
        abortRef.current.abort();
      }
      if (tokenRef.current) {
        stopSearchPrices(tokenRef.current).catch(() => {});
        tokenRef.current = null;
      }
      const controller = new AbortController();
      abortRef.current = controller;
      mutation.mutate({
        countryId,
        destination,
        signal: controller.signal,
        tokenRef,
      });
    },
    [queryClient, mutation]
  );

  const loading = mutation.isPending || queryLoading;
  const loadingForCountryId =
    mutation.isPending && mutation.variables
      ? mutation.variables.countryId
      : null;

  const error = useMemo((): Error | null => {
    if (validationMessage) return new Error(validationMessage);
    if (mutation.error && !isSearchCancelledError(mutation.error))
      return toError(mutation.error);
    if (queryError) return toError(queryError);
    return null;
  }, [validationMessage, mutation.error, queryError]);

  return {
    search,
    tours,
    loading,
    error,
    hasSearched: destinationForResultsFilter !== null,
    loadingForCountryId,
  };
}
