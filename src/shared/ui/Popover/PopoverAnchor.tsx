import { forwardRef, ReactNode } from "react";

export type PopoverAnchorProps = {
  children: ReactNode;
};

export const PopoverAnchor = forwardRef<HTMLDivElement, PopoverAnchorProps>(
  ({ children }, ref) => <div ref={ref}>{children}</div>
);

PopoverAnchor.displayName = "PopoverAnchor";
