import { FC } from "react";
import type { TourCardViewModel } from "@/features/tours-search/services/toursAggregator";
import styles from "./TourCard.module.css";

export type TourCardProps = {
  card: TourCardViewModel;
};

function formatDisplayDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export const TourCard: FC<TourCardProps> = ({ card }) => (
  <article className={styles.card}>
    {card.imageUrl && (
      <img src={card.imageUrl} alt="" className={styles.img} loading="lazy" />
    )}
    <div className={styles.body}>
      <h3 className={styles.title}>{card.hotelName}</h3>
      {card.location && <p className={styles.location}>{card.location}</p>}
      {card.startDate && (
        <p className={styles.date}>
          Старт: {formatDisplayDate(card.startDate)}
        </p>
      )}
      <p className={styles.price}>{card.price.toLocaleString()} грн</p>
      {card.nights > 0 && <p className={styles.nights}>{card.nights} ночей</p>}
      <a href="#" className={styles.link}>
        Відкрити ціну
      </a>
    </div>
  </article>
);
