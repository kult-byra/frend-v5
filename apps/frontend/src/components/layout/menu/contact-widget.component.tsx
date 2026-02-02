"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/icon.component";
import { cn } from "@/utils/cn.util";
import { ContactWidgetContent } from "./contact-widget-content.component";
import type { LinkGroupProps } from "./menu.types";

type ContactWidgetProps = {
  isOpen: boolean;
  onClose: () => void;
  linkGroup: LinkGroupProps | undefined;
};

export const ContactWidget = ({ isOpen, onClose, linkGroup }: ContactWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button when opening
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape (but not if a select dropdown is open)
      if (e.key === "Escape") {
        const target = e.target as Element;

        // Don't close if event originates from within a Radix Select dropdown
        const isInSelect =
          target.closest?.("[data-radix-select-content]") ||
          target.closest?.("[data-radix-select-viewport]") ||
          target.closest?.("[role='listbox']");
        if (isInSelect) return;

        // Also check if any select trigger is in open state
        const openSelectTrigger = document.querySelector(
          "[data-radix-select-trigger][data-state='open']",
        );
        if (openSelectTrigger) return;

        onClose();
        return;
      }

      // Focus trap on Tab
      if (e.key === "Tab" && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Use capture phase to check for open selects before Radix closes them
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, onClose]);

  if (!linkGroup || linkGroup.menuType !== "contact") return null;

  return (
    <div
      ref={containerRef}
      data-menu-panel
      className={cn(
        "fixed bottom-0 right-0 z-50 hidden w-full max-w-[475px] bg-container-overlay-primary-2 transition-transform duration-200 ease-out laptop:block",
        isOpen ? "translate-y-0" : "translate-y-full pointer-events-none",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Kontaktskjema"
      aria-hidden={!isOpen}
      inert={!isOpen ? true : undefined}
    >
      {/* Close button row */}
      <div className="flex items-center justify-end pb-2xs pl-xs pr-2xs pt-2xs">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Lukk kontaktskjema"
          className="flex size-8 items-center justify-center"
        >
          <Icon name="close" className="size-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-xs pb-xs">
        <ContactWidgetContent linkGroup={linkGroup} onLinkClick={onClose} />
      </div>
    </div>
  );
};
