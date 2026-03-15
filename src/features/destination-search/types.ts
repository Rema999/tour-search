export type DestinationOptionType = "country" | "city" | "hotel";

export type DestinationOption = {
  id: string;
  label: string;
  type: DestinationOptionType;
  countryId: string;
};
