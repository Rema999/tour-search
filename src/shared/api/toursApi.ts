import * as api from "../../../api.js";

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? "Request failed");
  }
  return data as T;
}

export async function getCountries() {
  const response = await api.getCountries();
  return parseResponse<
    Record<string, { id: string; name: string; flag: string }>
  >(response);
}

export async function searchGeo(query: string) {
  const response = await api.searchGeo(query);
  return parseResponse<
    Record<string, { id: string; name: string; type: string }>
  >(response);
}

export async function startSearchPrices(countryID: string) {
  const response = await api.startSearchPrices(countryID);
  return parseResponse<{ token: string; waitUntil: string }>(response);
}

export async function getSearchPrices(token: string) {
  const response = await api.getSearchPrices(token);
  return parseResponse<{ prices: Record<string, unknown> }>(response);
}

export type GetSearchPricesResult =
  | { status: 200; data: { prices: Record<string, unknown> } }
  | { status: 425; data: { message?: string; waitUntil: string } }
  | { status: 404; data: { message?: string } }
  | { status: number; data: { message?: string } };

export async function getSearchPricesResult(
  token: string
): Promise<GetSearchPricesResult> {
  let response: Response;
  try {
    response = await api.getSearchPrices(token);
  } catch (e) {
    response = e as Response;
  }
  const data = (await response.json()) as {
    message?: string;
    waitUntil?: string;
    prices?: Record<string, unknown>;
  };
  const status = response.status;
  if (status === 200 && data.prices != null) {
    return { status: 200, data: { prices: data.prices } };
  }
  if (status === 425) {
    return {
      status: 425,
      data: {
        message: data.message,
        waitUntil: data.waitUntil ?? new Date(Date.now() + 5000).toISOString(),
      },
    };
  }
  return { status, data: { message: data.message } };
}

export async function stopSearchPrices(token: string) {
  const response = await api.stopSearchPrices(token);
  return parseResponse<{ message: string }>(response);
}

export async function getHotels(countryID: string) {
  const response = await api.getHotels(countryID);
  return parseResponse<Record<string, unknown>>(response);
}

export async function getHotel(hotelId: number) {
  const response = await api.getHotel(hotelId);
  return parseResponse<Record<string, unknown>>(response);
}

export async function getPrice(priceId: string) {
  const response = await api.getPrice(priceId);
  return parseResponse<Record<string, unknown>>(response);
}
