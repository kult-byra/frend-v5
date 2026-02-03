"use client";

import { useState } from "react";
import { Icon } from "@/components/icon.component";
import { cn } from "@/utils/cn.util";
import { PortableText, type PortableTextOptions } from "./portable-text.component";

type AccordionItemProps = {
  heading: string;
  content: Parameters<typeof PortableText>[0]["content"];
  defaultOpen?: boolean;
  options?: PortableTextOptions;
};

function AccordionItem({ heading, content, defaultOpen = false, options }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-stroke-soft">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start gap-xs py-3xs text-left"
        aria-expanded={isOpen}
      >
        <span className="flex-1 text-base font-semibold leading-[145%] text-text-primary">
          {heading}
        </span>
        <span className="flex size-8 shrink-0 items-center justify-center">
          <Icon
            name="lg-chevron-down"
            className={cn(
              "size-3 text-text-primary transition-transform duration-300",
              isOpen && "rotate-180",
            )}
          />
        </span>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="max-w-[540px] pb-xs">
            <PortableText content={content} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}

export type AccordionsBlockProps = {
  accordions?: Array<{
    _key: string;
    heading?: string;
    content?: Parameters<typeof PortableText>[0]["content"];
  }>;
  options?: PortableTextOptions;
};

export function AccordionsBlock({ accordions, options }: AccordionsBlockProps) {
  if (!accordions || accordions.length === 0) return null;

  return (
    <div className="my-[1em]">
      {accordions.map((accordion, index) => (
        <AccordionItem
          key={accordion._key}
          heading={accordion.heading ?? ""}
          content={accordion.content ?? null}
          defaultOpen={index === 0}
          options={options}
        />
      ))}
    </div>
  );
}
