import { InputHTMLAttributes, forwardRef, useId } from "react";
import Input from "./Input";
import styles from "./Input.module.css";

export type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      label,
      error,
      hint,
      className = "",
      "aria-describedby": ariaDescribedby,
      ...inputProps
    },
    ref
  ) => {
    const fallbackId = useId();
    const generatedId = id ?? fallbackId;
    const describedBy =
      [error && `${generatedId}-error`, hint && `${generatedId}-hint`]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className={styles.field}>
        {label && (
          <label htmlFor={generatedId} className={styles.label}>
            {label}
          </label>
        )}
        <Input
          ref={ref}
          id={generatedId}
          className={className}
          error={Boolean(error)}
          aria-describedby={ariaDescribedby ?? describedBy}
          {...inputProps}
        />
        {error && (
          <span
            id={`${generatedId}-error`}
            className={styles.error}
            role="alert"
          >
            {error}
          </span>
        )}
        {hint && !error && (
          <span id={`${generatedId}-hint`} className={styles.hint}>
            {hint}
          </span>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
