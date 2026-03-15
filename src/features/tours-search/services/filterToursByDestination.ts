import type { DestinationOption } from "@/features/destination-search";
import type { TourCardViewModel } from "./toursAggregator";

/**
 * Filters cached tours by the selected destination for display. Country: returns
 * the full list; city/hotel: filters by cityId or hotelId. Does not mutate; preserves price order.
 */
export function filterToursByDestination(
  tours: TourCardViewModel[],
  destination: DestinationOption | null
): TourCardViewModel[] {
  if (!destination) return [];
  if (destination.type === "country") return tours;
  if (destination.type === "city") {
    return tours.filter(t => String(t.cityId) === destination.id);
  }
  if (destination.type === "hotel") {
    return tours.filter(t => String(t.hotelId) === destination.id);
  }
  return tours;
}
