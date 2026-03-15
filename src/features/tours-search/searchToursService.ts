import type { DestinationOption } from "@/features/destination-search";
import {
  startSearchPrices,
  getSearchPricesResult,
  stopSearchPrices,
} from "@/shared/api";
import { sleepUntil } from "@/shared/lib/sleep";
import {
  type SearchToursParams,
  type SearchExhaustedError,
  type SearchCancelledError,
  SEARCH_EXHAUSTED_CODE,
  SEARCH_CANCELLED_CODE,
} from "./searchTours.types";
import { sleep } from "@/shared/lib/sleep";
import { aggregateToursToViewModels } from "./services/toursAggregator";
import type { TourCardViewModel } from "./services/toursAggregator";

export type SearchToursCancelOptions = {
  signal?: AbortSignal;
  onToken?: (token: string) => void;
};

/** Number of retries after the first request (1 + MAX_RETRIES requests in total). */
const MAX_RETRIES = 2;
/** Maximum 425-wait iterations to avoid an infinite loop. */
const MAX_POLL_ITERATIONS = 120;

export type SearchToursRawResult = {
  prices: Record<string, unknown>;
};

export type TourSearchByDestinationResult = {
  countryId: string;
  prices: SearchToursRawResult["prices"];
};

export function getCountryIdFromDestination(
  destination: DestinationOption | null
): string | null {
  if (destination == null) return null;
  if (destination.type === "country") return destination.id;
  return destination.countryId ?? null;
}

export async function searchToursByDestination(
  destination: DestinationOption | null
): Promise<TourSearchByDestinationResult> {
  const countryId = getCountryIdFromDestination(destination);
  if (!countryId) {
    throw new Error("Select a destination to search");
  }
  const result = await searchTours({ countryId });
  return { countryId, prices: result.prices };
}

/**
 * Runs the full tour search for a country: executes the search API (with optional
 * cancellation), then aggregates raw prices with hotel data into TourCardViewModel[].
 */
export async function runToursSearchByCountryId(
  countryId: string,
  options?: SearchToursCancelOptions
): Promise<TourCardViewModel[]> {
  const result = await searchTours({ countryId }, options);
  return aggregateToursToViewModels(result.prices, countryId);
}

function checkCancelled(
  signal: AbortSignal | undefined,
  token: string
): never | void {
  if (signal?.aborted) {
    stopSearchPrices(token).catch(() => undefined);
    const err: SearchCancelledError = {
      code: SEARCH_CANCELLED_CODE,
      message: "Search cancelled",
    };
    throw err;
  }
}

/**
 * Starts a price search by countryId, waits until the required time, then polls
 * getSearchPrices until results are ready (200) or retries are exhausted.
 * Supports cancellation via AbortSignal; onToken is called when the search token is available.
 */
export async function searchTours(
  params: SearchToursParams,
  options?: SearchToursCancelOptions
): Promise<SearchToursRawResult> {
  const { signal, onToken } = options ?? {};
  const { token, waitUntil } = await startSearchPrices(params.countryId);
  onToken?.(token);
  checkCancelled(signal, token);
  await sleepUntil(waitUntil);
  checkCancelled(signal, token);

  let lastMessage = "Search failed after retries";
  let retries = 0;
  let pollCount = 0;

  while (pollCount < MAX_POLL_ITERATIONS) {
    checkCancelled(signal, token);
    const result = await getSearchPricesResult(token);
    checkCancelled(signal, token);

    if (result.status === 200 && "prices" in result.data) {
      return { prices: result.data.prices };
    }

    if (result.status === 425 && "waitUntil" in result.data) {
      pollCount++;
      await sleepUntil(result.data.waitUntil);
      continue;
    }

    const message = "message" in result.data ? result.data.message : undefined;
    lastMessage =
      message ?? (result.status === 404 ? "Search not found" : "Search failed");

    retries++;
    if (retries > MAX_RETRIES) {
      const error: SearchExhaustedError = {
        code: SEARCH_EXHAUSTED_CODE,
        message: lastMessage,
      };
      throw error;
    }
    await sleep(1000);
    checkCancelled(signal, token);
  }

  const error: SearchExhaustedError = {
    code: SEARCH_EXHAUSTED_CODE,
    message: "Search timed out: results not ready after maximum wait",
  };
  throw error;
}
