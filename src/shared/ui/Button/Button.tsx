import { ButtonHTMLAttributes, forwardRef } from "react";
import Spinner from "@/shared/ui/Spinner";
import styles from "./Button.module.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", type = "button", disabled, loading = false, children, ...props },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={`${styles.button} ${className}`.trim()}
      disabled={disabled ?? loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <Spinner size="sm" className={styles.spinner} />}
      {children}
    </button>
  )
);

Button.displayName = "Button";

export default Button;
