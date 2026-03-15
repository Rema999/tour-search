import { FC, ReactNode } from "react";
import styles from "./TourGrid.module.css";

export type TourGridProps = {
  children: ReactNode;
};

export const TourGrid: FC<TourGridProps> = ({ children }) => (
  <div className={styles.grid}>{children}</div>
);
