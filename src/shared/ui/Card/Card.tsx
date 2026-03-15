import { FC, HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

const Card: FC<CardProps> = ({ className = "", children, ...props }) => (
  <div className={`${styles.card} ${className}`.trim()} {...props}>
    {children}
  </div>
);

export default Card;
