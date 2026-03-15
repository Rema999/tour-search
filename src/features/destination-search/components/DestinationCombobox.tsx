import { useState } from "react";
import Combobox from "@/shared/ui/Combobox";
import { DestinationOption as DestinationOptionView } from "./DestinationOption";
import { useDestinationOptions } from "../useDestinationOptions";
import type { DestinationOption } from "../types";

export type DestinationComboboxProps = {
  value: DestinationOption | null;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  onSelect: (option: DestinationOption | null) => void;
  placeholder?: string;
};

export function DestinationCombobox({
  value,
  inputValue,
  onInputValueChange,
  onSelect,
  placeholder = "Destination",
}: DestinationComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { options } = useDestinationOptions(inputValue, value);

  return (
    <Combobox<DestinationOption>
      value={value}
      inputValue={inputValue}
      options={options}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onInputValueChange={onInputValueChange}
      onSelect={onSelect}
      getOptionKey={(o) => o.id}
      renderOption={(o) => <DestinationOptionView option={o} />}
      placeholder={placeholder}
    />
  );
}
