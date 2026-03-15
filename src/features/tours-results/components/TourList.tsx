import { FC } from "react";
import type { TourCardViewModel } from "@/features/tours-search/services/toursAggregator";
import { TourGrid } from "./TourGrid";
import { TourCard } from "./TourCard";

export type TourListProps = {
  cards: TourCardViewModel[];
};

export const TourList: FC<TourListProps> = ({ cards }) => (
  <TourGrid>
    {cards.map((card) => (
      <TourCard key={card.id} card={card} />
    ))}
  </TourGrid>
);
