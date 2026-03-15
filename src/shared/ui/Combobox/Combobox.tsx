import React, {
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  ReactNode,
  KeyboardEvent,
} from "react";
import Input from "@/shared/ui/Input";
import { ComboboxList } from "./ComboboxList";
import { useComboboxHighlight } from "./useComboboxHighlight";
import { useComboboxKeyboard } from "./useComboboxKeyboard";
import styles from "./Combobox.module.css";

export type ComboboxProps<T> = {
  value: T | null;
  inputValue: string;
  options: T[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onInputValueChange: (value: string) => void;
  onSelect: (option: T) => void;
  getOptionKey: (option: T) => string;
  renderOption: (option: T) => ReactNode;
  placeholder?: string;
  disabled?: boolean;
};

function ComboboxInner<T>({
  inputValue,
  options,
  isOpen,
  onOpenChange,
  onInputValueChange,
  onSelect,
  getOptionKey,
  renderOption,
  placeholder = "",
  disabled = false,
}: ComboboxProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [highlightedIndex, setHighlightedIndex] = useComboboxHighlight(
    isOpen,
    options.length
  );

  const open = useCallback(() => onOpenChange(true), [onOpenChange]);
  const close = useCallback(() => {
    onOpenChange(false);
    setHighlightedIndex(-1);
  }, [onOpenChange, setHighlightedIndex]);

  const handleSelect = useCallback(
    (option: T) => {
      onSelect(option);
      close();
    },
    [onSelect, close]
  );

  const handleKeyDown = useComboboxKeyboard({
    isOpen,
    options,
    highlightedIndex,
    setHighlightedIndex,
    open,
    close,
    onSelect: handleSelect,
  });

  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;
    const el = listRef.current.children[highlightedIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  useLayoutEffect(() => {
    if (isOpen) anchorRef.current?.focus();
  }, [isOpen, inputValue, options.length]);

  useLayoutEffect(() => {
    if (!isOpen || !close) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen, close]);

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onInputValueChange("");
      anchorRef.current?.focus();
    },
    [onInputValueChange]
  );

  return (
    <div ref={rootRef} className={styles.combobox}>
      <div className={styles.inputWrap}>
        <Input
          ref={anchorRef}
          value={inputValue}
          onChange={e => onInputValueChange(e.target.value)}
          onFocus={open}
          onClick={open}
          onKeyDown={
            handleKeyDown as (e: KeyboardEvent<HTMLInputElement>) => void
          }
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-activedescendant={
            isOpen && highlightedIndex >= 0 && options[highlightedIndex] != null
              ? `combobox-option-${getOptionKey(options[highlightedIndex])}`
              : undefined
          }
          className={inputValue ? styles.inputWithClear : undefined}
        />
        {inputValue ? (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Clear"
            tabIndex={-1}
          >
            ×
          </button>
        ) : null}
      </div>
      {isOpen && (
        <div className={styles.listWrap}>
          <ComboboxList
            listRef={listRef}
            options={options}
            highlightedIndex={highlightedIndex}
            getOptionKey={getOptionKey}
            renderOption={renderOption}
            onSelect={handleSelect}
            onHighlight={setHighlightedIndex}
          />
        </div>
      )}
    </div>
  );
}

const Combobox = ComboboxInner as <T>(
  props: ComboboxProps<T>
) => React.JSX.Element;

export default Combobox;
