import { FC, ReactNode } from "react";
import styles from "./EmptyState.module.css";

export type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

const EmptyState: FC<EmptyStateProps> = ({ title, description, action }) => (
  <div className={styles.empty} role="status">
    <p className={styles.title}>{title}</p>
    {description && <p className={styles.description}>{description}</p>}
    {action && <div className={styles.action}>{action}</div>}
  </div>
);

export default EmptyState;
