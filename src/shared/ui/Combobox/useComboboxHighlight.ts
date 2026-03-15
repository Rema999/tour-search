import { useEffect, useState } from "react";

export function useComboboxHighlight(isOpen: boolean, optionsLength: number) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    if (!isOpen) setHighlightedIndex(-1);
    else if (optionsLength > 0) setHighlightedIndex(0);
  }, [isOpen, optionsLength]);

  return [highlightedIndex, setHighlightedIndex] as const;
}
