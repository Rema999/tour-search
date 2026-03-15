import { FC } from "react";
import styles from "./Spinner.module.css";

export type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = { sm: styles.sm, md: styles.md, lg: styles.lg };

const Spinner: FC<SpinnerProps> = ({ size = "md", className = "" }) => (
  <span
    className={`${styles.spinner} ${sizeClass[size]} ${className}`.trim()}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;
