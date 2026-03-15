import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./Input.module.css";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => (
    <input
      ref={ref}
      className={`${styles.input} ${
        error ? styles.error : ""
      } ${className}`.trim()}
      aria-invalid={error}
      {...props}
    />
  )
);

Input.displayName = "Input";

export default Input;
