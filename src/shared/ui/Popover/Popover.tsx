import {
  FC,
  ReactNode,
  RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Popover.module.css";

export type PopoverProps = {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
};

const Popover: FC<PopoverProps> = ({ anchorRef, open, onClose, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const close = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) {
      setPosition(null);
      return;
    }
    const rect = anchorRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom, left: rect.left });
  }, [open, anchorRef]);

  useLayoutEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  useLayoutEffect(() => {
    if (!open || !onClose) return;
    const handleClick = (e: MouseEvent) => {
      const el = contentRef.current;
      const anchor = anchorRef.current;
      if (el?.contains(e.target as Node) || anchor?.contains(e.target as Node))
        return;
      onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const content = (
    <div
      ref={contentRef}
      className={styles.popover}
      style={
        position
          ? { top: position.top, left: position.left }
          : { visibility: "hidden" }
      }
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );

  return createPortal(content, document.body);
};

export default Popover;
