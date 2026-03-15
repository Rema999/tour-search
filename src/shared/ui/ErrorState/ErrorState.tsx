import { FC, ReactNode } from "react";
import styles from "./ErrorState.module.css";

export type ErrorStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
};

const ErrorState: FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message,
  action,
}) => (
  <div className={styles.error} role="alert">
    <p className={styles.title}>{title}</p>
    <p className={styles.message}>{message}</p>
    {action && <div className={styles.action}>{action}</div>}
  </div>
);

export default ErrorState;
