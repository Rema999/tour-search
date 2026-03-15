import { useCallback, KeyboardEvent } from "react";

export type UseComboboxKeyboardOptions<T> = {
  isOpen: boolean;
  options: T[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number | ((prev: number) => number)) => void;
  open: () => void;
  close: () => void;
  onSelect: (option: T) => void;
};

export function useComboboxKeyboard<T>({
  isOpen,
  options,
  highlightedIndex,
  setHighlightedIndex,
  open,
  close,
  onSelect,
}: UseComboboxKeyboardOptions<T>) {
  return useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          open();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex(i => (i < options.length - 1 ? i + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex(i => (i > 0 ? i - 1 : options.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && options[highlightedIndex] != null) {
            onSelect(options[highlightedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          close();
          break;
        default:
          break;
      }
    },
    [isOpen, options, highlightedIndex, open, close, onSelect]
  );
}
