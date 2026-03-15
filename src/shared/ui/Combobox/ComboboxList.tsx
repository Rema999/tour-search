import { ReactNode, RefObject } from "react";
import styles from "./Combobox.module.css";

export type ComboboxListProps<T> = {
  options: T[];
  highlightedIndex: number;
  getOptionKey: (option: T) => string;
  renderOption: (option: T) => ReactNode;
  onSelect: (option: T) => void;
  onHighlight: (index: number) => void;
  listRef?: RefObject<HTMLUListElement | null>;
  emptyMessage?: string;
};

export function ComboboxList<T>({
  options,
  highlightedIndex,
  getOptionKey,
  renderOption,
  onSelect,
  onHighlight,
  listRef,
  emptyMessage = "No results",
}: ComboboxListProps<T>) {
  return (
    <ul
      ref={listRef}
      className={styles.list}
      role="listbox"
      onMouseDown={e => e.preventDefault()}
    >
      {options.length === 0 ? (
        <li className={styles.itemEmpty} role="option">
          {emptyMessage}
        </li>
      ) : (
        options.map((option, index) => (
          <li
            key={getOptionKey(option)}
            id={`combobox-option-${getOptionKey(option)}`}
            className={`${styles.item} ${
              index === highlightedIndex ? styles.highlighted : ""
            }`}
            role="option"
            aria-selected={index === highlightedIndex}
            onClick={() => onSelect(option)}
            onMouseEnter={() => onHighlight(index)}
          >
            {renderOption(option)}
          </li>
        ))
      )}
    </ul>
  );
}
