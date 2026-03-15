import { FC, FormEvent } from "react";
import { DestinationCombobox } from "@/features/destination-search";
import type { DestinationOption } from "@/features/destination-search";
import { Button } from "@/shared/ui";
import styles from "./SearchForm.module.css";

export type SearchFormProps = {
  selectedDestination: DestinationOption | null;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  onSelect: (destination: DestinationOption | null) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  placeholder?: string;
};

export const SearchForm: FC<SearchFormProps> = ({
  selectedDestination,
  inputValue,
  onInputValueChange,
  onSelect,
  onSubmit,
  isSubmitting,
  placeholder = "Destination",
}) => {
  const canSubmit = !!selectedDestination;
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Destination</label>
        <DestinationCombobox
          value={selectedDestination}
          inputValue={inputValue}
          onInputValueChange={onInputValueChange}
          onSelect={onSelect}
          placeholder={placeholder}
        />
      </div>
      <Button
        type="submit"
        className={styles.submitBtn}
        disabled={!canSubmit || isSubmitting}
        loading={isSubmitting}
      >
        {isSubmitting ? "Пошук…" : "Знайти"}
      </Button>
    </form>
  );
};
