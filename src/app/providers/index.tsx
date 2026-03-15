import { FC, ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";

export const AppProviders: FC<{ children: ReactNode }> = ({ children }) => (
  <QueryProvider>{children}</QueryProvider>
);
