import { FC } from "react";
import type { DestinationOption } from "../types";
import styles from "./DestinationOption.module.css";

export type DestinationOptionProps = {
  option: DestinationOption;
};

const typeIcon: Record<DestinationOption["type"], string> = {
  country: "🌐",
  city: "📍",
  hotel: "🏨",
};

const typeLabel: Record<DestinationOption["type"], string> = {
  country: "Country",
  city: "City",
  hotel: "Hotel",
};

export const DestinationOption: FC<DestinationOptionProps> = ({ option }) => (
  <span className={styles.option}>
    <span className={styles.icon} aria-hidden>
      {typeIcon[option.type]}
    </span>
    <span className={styles.label}>{option.label}</span>
    <span className={styles[option.type]} aria-hidden>
      {typeLabel[option.type]}
    </span>
  </span>
);
