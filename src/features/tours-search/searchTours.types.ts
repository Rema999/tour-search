export type SearchToursParams = {
  countryId: string;
};

export type SearchPricesResult = {
  prices: Record<string, unknown>;
};

export type SearchToursSuccess = {
  ok: true;
  prices: Record<string, unknown>;
};

export type SearchToursFailure = {
  ok: false;
  error: SearchToursError;
};

export type SearchToursResult = SearchToursSuccess | SearchToursFailure;

export const SEARCH_NOT_READY_CODE = "SEARCH_NOT_READY" as const;
export const SEARCH_NOT_FOUND_CODE = "SEARCH_NOT_FOUND" as const;
export const SEARCH_EXHAUSTED_CODE = "SEARCH_EXHAUSTED" as const;
export const SEARCH_CANCELLED_CODE = "SEARCH_CANCELLED" as const;

export type SearchCancelledError = {
  code: typeof SEARCH_CANCELLED_CODE;
  message: string;
};

export type SearchNotReadyError = {
  code: typeof SEARCH_NOT_READY_CODE;
  message: string;
  waitUntil: string;
};

export type SearchNotFoundError = {
  code: typeof SEARCH_NOT_FOUND_CODE;
  message: string;
};

export type SearchExhaustedError = {
  code: typeof SEARCH_EXHAUSTED_CODE;
  message: string;
};

export type SearchToursError =
  | SearchNotReadyError
  | SearchNotFoundError
  | SearchExhaustedError
  | SearchCancelledError;

export function isSearchCancelledError(
  e: unknown
): e is SearchCancelledError {
  return typeof e === "object" && e !== null && (e as SearchCancelledError).code === SEARCH_CANCELLED_CODE;
}

export function isSearchNotReadyError(
  e: SearchToursError
): e is SearchNotReadyError {
  return e.code === SEARCH_NOT_READY_CODE;
}

export function isSearchNotFoundError(
  e: SearchToursError
): e is SearchNotFoundError {
  return e.code === SEARCH_NOT_FOUND_CODE;
}
