import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toPlainText } from "next-sanity";
import type { ServicesListQueryResult } from "@/sanity-types";
import { cn } from "@/utils/cn.util";

type ServiceItem = ServicesListQueryResult[number];

type ServiceCardProps = {
  title: string;
  slug: string;
  excerpt: ServiceItem["excerpt"] | null;
  illustration: string | null;
  colorVariant: "purple" | "red";
};

export function ServiceCard({
  title,
  slug,
  excerpt,
  illustration,
  colorVariant,
}: ServiceCardProps) {
  return (
    <Link
      href={`/tjenester/${slug}`}
      className={cn(
        "group flex flex-col rounded overflow-hidden",
        colorVariant === "purple" ? "bg-container-secondary" : "bg-container-tertiary-1",
      )}
    >
      {/* Illustration */}
      <div className="pt-(--gutter) px-(--gutter) pb-10 flex items-center justify-center">
        {illustration && (
          <Image
            src={illustration}
            alt=""
            width={120}
            height={120}
            className="size-[120px] object-contain"
          />
        )}
      </div>

      {/* Text */}
      <div className="p-(--gutter) flex flex-col gap-(--gutter) flex-1">
        <h3 className="text-headline-3">{title}</h3>
        {excerpt && <p className="text-body text-text-secondary">{toPlainText(excerpt)}</p>}
      </div>

      {/* Arrow button */}
      <div className="border-t p-(--gutter)">
        <div className="size-8 rounded-full bg-container-brand-1 group-hover:bg-button-primary-hover flex items-center justify-center transition-colors">
          <ArrowRight className="size-4 text-white" />
        </div>
      </div>
    </Link>
  );
}
