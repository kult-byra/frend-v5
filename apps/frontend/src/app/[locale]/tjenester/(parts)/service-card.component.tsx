import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { toPlainText } from "next-sanity";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { Img, type ImgProps } from "@/components/utils/img.component";
import type { ServicesListQueryResult } from "@/sanity-types";
import { cn } from "@/utils/cn.util";

type ServiceItem = ServicesListQueryResult[number];

type ServiceMedia = {
  mediaType: "image" | "illustration" | null;
  image: ImgProps | null;
  illustration: string | null;
};

type ServiceCardProps = {
  title: string;
  slug: string;
  excerpt: ServiceItem["excerpt"] | null;
  media: ServiceMedia | null;
  colorVariant: "purple" | "red";
};

export function ServiceCard({
  title,
  slug,
  excerpt,
  media,
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
        {media?.mediaType === "image" && media.image && (
          <Img
            {...media.image}
            sizes={{ md: "third" }}
            className="size-[120px] object-contain"
          />
        )}
        {media?.mediaType === "illustration" && media.illustration && (
          <Illustration
            name={media.illustration as IllustrationName}
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
