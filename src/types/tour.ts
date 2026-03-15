export type Tour = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
};

export type TourSearchParams = {
  destination?: string;
  startDate?: string;
  endDate?: string;
};

export type Destination = {
  id: string;
  name: string;
};
