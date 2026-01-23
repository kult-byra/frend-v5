import type { Dispatch, SetStateAction } from "react";

import { cn } from "@/utils/cn.util";

export const MenuToggle = ({
  isOpen,
  setIsOpen,
  className,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
}) => (
  <button
    type="button"
    aria-expanded={isOpen}
    aria-controls="mobile-navigation-menu"
    aria-label={"Meny"}
    className={cn(
      className,
      "cursor-pointer laptop:hidden group flex items-center gap-[0.7em] text-sm sm:text-base",
    )}
    onClick={() => setIsOpen(!isOpen)}
  >
    <span className="relative">
      {!isOpen && <span className="sr-only">Åpne</span>}
      {isOpen ? "Lukk" : "Meny"}
      {isOpen && <span className="sr-only">meny</span>}
    </span>
    <span className={cn("text-dark relative block h-[1.1em] w-[1.5em]")}>
      <MenuToggleLine i={0} isOpen={isOpen} />
      <MenuToggleLine i={1} isOpen={isOpen} />
      <MenuToggleLine i={2} isOpen={isOpen} />
      <MenuToggleLine i={3} isOpen={isOpen} />
    </span>
  </button>
);

const MenuToggleLine = ({ i, isOpen }: { i: number; isOpen: boolean }) => {
  return (
    <span
      className={cn(getLineStyle(i, isOpen), "absolute block h-[2px] w-full bg-current transition")}
    />
  );
};

const getLineStyle = (i: number, isOpen: boolean) => {
  switch (i) {
    case 0:
      return isOpen ? "top-0 opacity-0" : "top-0";
    case 1:
      return isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-1/2 -translate-y-1/2";
    case 2:
      return isOpen
        ? "top-1/2 -translate-y-1/2 -rotate-45 opacity-100"
        : "top-1/2 -translate-y-1/2 opacity-0";
    case 3:
      return isOpen ? "bottom-0 opacity-0" : "bottom-0";
  }
};
