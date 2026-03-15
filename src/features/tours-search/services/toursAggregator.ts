import { getHotels } from "@/shared/api";

export type TourCardViewModel = {
  id: string;
  hotelId: number;
  cityId: number;
  hotelName: string;
  imageUrl: string;
  location: string;
  startDate: string;
  price: number;
  nights: number;
};

type RawPrice = {
  id: string;
  amount: number;
  hotelID: number;
  startDate: string;
  endDate: string;
};

type HotelRecord = {
  id: number;
  name: string;
  img: string;
  cityId: number;
  cityName: string;
  countryName: string;
};

type MergedItem = {
  priceId: string;
  amount: number;
  hotel: HotelRecord;
  startDate: string;
  endDate: string;
};

function parseRawPrice(entry: unknown): RawPrice | null {
  if (!entry || typeof entry !== "object") return null;
  const v = entry as Record<string, unknown>;
  const hotelID = typeof v.hotelID === "number" ? v.hotelID : Number(v.hotelID);
  if (Number.isNaN(hotelID)) return null;
  return {
    id: String(v.id ?? ""),
    amount: Number(v.amount ?? 0),
    hotelID,
    startDate: String(v.startDate ?? ""),
    endDate: String(v.endDate ?? ""),
  };
}

function parseHotel(raw: Record<string, unknown>): HotelRecord {
  return {
    id: Number(raw.id),
    name: String(raw.name ?? ""),
    img: String(raw.img ?? ""),
    cityId: Number(raw.cityId ?? 0),
    cityName: String(raw.cityName ?? ""),
    countryName: String(raw.countryName ?? ""),
  };
}

function parseHotelsMap(raw: Record<string, unknown>): Map<number, HotelRecord> {
  const map = new Map<number, HotelRecord>();
  for (const value of Object.values(raw)) {
    if (value && typeof value === "object") {
      const hotel = parseHotel(value as Record<string, unknown>);
      map.set(hotel.id, hotel);
    }
  }
  return map;
}

function nightsFromDates(start: string, end: string): number {
  if (!start || !end) return 0;
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.max(0, Math.round((b - a) / (24 * 60 * 60 * 1000)));
}

function mergeAndSort(
  prices: Record<string, unknown>,
  hotelsMap: Map<number, HotelRecord>
): MergedItem[] {
  const merged: MergedItem[] = [];
  for (const entry of Object.values(prices)) {
    const price = parseRawPrice(entry);
    if (!price) continue;
    const hotel = hotelsMap.get(price.hotelID);
    if (!hotel) continue;
    merged.push({
      priceId: price.id,
      amount: price.amount,
      hotel,
      startDate: price.startDate,
      endDate: price.endDate,
    });
  }
  merged.sort((a, b) => a.amount - b.amount);
  return merged;
}

function toViewModel(item: MergedItem): TourCardViewModel {
  const location = [item.hotel.cityName, item.hotel.countryName]
    .filter(Boolean)
    .join(", ");
  return {
    id: item.priceId,
    hotelId: item.hotel.id,
    cityId: item.hotel.cityId,
    hotelName: item.hotel.name,
    imageUrl: item.hotel.img,
    location: location || "—",
    startDate: item.startDate,
    price: item.amount,
    nights: nightsFromDates(item.startDate, item.endDate),
  };
}

/**
 * Loads hotels for the country, merges raw prices with hotel records by hotel_id,
 * sorts by price ascending, and maps to TourCardViewModel[].
 */
export async function aggregateToursToViewModels(
  prices: Record<string, unknown>,
  countryId: string
): Promise<TourCardViewModel[]> {
  const rawHotels = await getHotels(countryId);
  const hotelsMap = parseHotelsMap(rawHotels as Record<string, unknown>);
  const merged = mergeAndSort(prices, hotelsMap);
  return merged.map(toViewModel);
}
