import { PortableText as PortableTextComponent } from "@portabletext/react";
import type { PropsWithChildren } from "react";
import { CallToActionBlock } from "@/components/blocks/call-to-action.block.component";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import {
  Heading,
  type HeadingLevel,
  type HeadingSize,
} from "@/components/layout/heading.component";
import { Img } from "@/components/utils/img.component";
import { LinkResolver } from "@/components/utils/link-resolver.component";
import type { FullPortableTextQueryTypeResult } from "@/sanity-types";
import { cn } from "@/utils/cn.util";
import { ImageAndTextBlock } from "../blocks/image-and-text.block.component";
import { AccordionsBlock } from "./accordion.component";
import type {
  BlockMarkRendererMap,
  BlockStylesRendererMap,
  BlockTypeRendererMap,
  ListLevelRenderMap,
  ListStyleRendererMap,
} from "./portable-text.types";

export type PortableTextOptions = {
  pSize?: string;
  topHLevel?: HeadingLevel;
  topHSize?: HeadingSize;
  disableStrong?: boolean;
  checklistIcon?: string | React.ReactNode;
};

const block = (options: PortableTextOptions): BlockStylesRendererMap => {
  const { pSize, topHLevel = 2, topHSize } = options ?? {};

  const headingStyle = "mb-[0.5em] mt-[2em] first:mt-0 last:mb-0 scroll-mt-24";

  return {
    h2: ({ children, value }) => (
      <Heading
        level={topHLevel}
        size={topHSize ?? topHLevel}
        className={headingStyle}
        id={value?._key ? `chapter-${value._key}` : undefined}
      >
        {children}
      </Heading>
    ),
    h3: ({ children, value }) => (
      <Heading
        level={(topHLevel + 1) as HeadingLevel}
        size={topHSize ? ((topHSize + 1) as HeadingSize) : ((topHLevel + 1) as HeadingSize)}
        className={headingStyle}
        id={value?._key ? `chapter-${value._key}` : undefined}
      >
        {children}
      </Heading>
    ),
    h4: ({ children }) => (
      <Heading
        level={(topHLevel + 2) as HeadingLevel}
        size={topHSize ? ((topHSize + 2) as HeadingSize) : ((topHLevel + 2) as HeadingSize)}
        className={headingStyle}
      >
        {children}
      </Heading>
    ),
    normal: ({ children }) => {
      // biome-ignore lint/suspicious/noExplicitAny: too many possible types
      if (!children || !(children as any).some((c: any) => c.props?.text || c.length > 0))
        return null; // Don't render empty p tags

      // biome-ignore lint/suspicious/noExplicitAny: too many possible types
      const firstChild = (children as any)[0];
      const isLink = typeof firstChild === "string" && firstChild?.startsWith("http");

      return <p className={cn(pSize, "mb-[1em] last:mb-0", isLink && "break-all")}>{children}</p>;
    },
  };
};

const marks = (options: PortableTextOptions): BlockMarkRendererMap<"strong" | "italic"> => {
  const { disableStrong } = options ?? {};

  return {
    link: ({ children, value }) => {
      const { url } = value ?? {};

      if (!url) return <>{children}</>;

      return (
        <LinkResolver
          linkType="external"
          url={url}
          className="underline underline-offset-4 text-text-secondary transition-colors hover:text-text-primary"
        >
          {children}
        </LinkResolver>
      );
    },

    internalLinkObject: ({ children, value }) => {
      const { internalLink } = value ?? {};

      if (!internalLink?._type) return <>{children}</>;

      return (
        <LinkResolver
          {...internalLink}
          linkType="internal"
          className="underline underline-offset-4 text-text-secondary transition-colors hover:text-text-primary"
        >
          {children}
        </LinkResolver>
      );
    },

    downloadLinkObject: ({ children, value }) => {
      const { url } = value ?? {};

      if (!url) return <>{children}</>;

      return (
        <LinkResolver
          linkType="download"
          url={url}
          className="underline underline-offset-4 text-text-secondary transition-colors hover:text-text-primary"
        >
          {children}
        </LinkResolver>
      );
    },

    strong: ({ children }: PropsWithChildren) => {
      if (disableStrong) return <>{children}</>;

      return <span className="font-semibold">{children}</span>;
    },

    italic: ({ children }: PropsWithChildren) => {
      return <span className="italic">{children}</span>;
    },
  };
};

const list = (options: PortableTextOptions): ListStyleRendererMap => {
  const { pSize } = options ?? {};

  const listStyle = "w-full mb-[2em] mt-[1em] space-y-[0.35em] first:mt-0 last:mb-0 pl-[1.75em]";
  const checkListStyle = "w-full mb-[2em] mt-[1em] space-y-3xs first:mt-0 last:mb-0";

  return {
    bullet: ({ children }: PropsWithChildren) => (
      <ul className={cn(pSize, listStyle, "list-disc")}>{children}</ul>
    ),
    number: ({ children }: PropsWithChildren) => (
      <ol className={cn(pSize, listStyle, "list-decimal")}>{children}</ol>
    ),
    dash: ({ children }: PropsWithChildren) => (
      <ul className={cn(pSize, listStyle, "list-none")}>{children}</ul>
    ),
    check: ({ children }: PropsWithChildren) => (
      <ul className={cn(pSize, checkListStyle, "list-none")}>{children}</ul>
    ),
  } as ListStyleRendererMap;
};

const listItem = (options: PortableTextOptions): ListLevelRenderMap => {
  const subLevelListItemStyle = "first:mt-[0.35em]";
  const { checklistIcon } = options ?? {};
  const checkIcon = checklistIcon ?? "✓";

  return {
    bullet: ({ children, value: { level } }: PropsWithChildren & { value: { level?: number } }) => (
      <li className={cn(level && level > 1 && subLevelListItemStyle)}>{children}</li>
    ),
    number: ({ children, value: { level } }: PropsWithChildren & { value: { level?: number } }) => (
      <li className={cn(level && level > 1 && subLevelListItemStyle)}>{children}</li>
    ),
    dash: ({ children, value: { level } }: PropsWithChildren & { value: { level?: number } }) => (
      <li
        className={cn(
          level && level > 1 && subLevelListItemStyle,
          "before:content-['-'] before:mr-2",
        )}
      >
        {children}
      </li>
    ),
    check: ({ children, value: { level } }: PropsWithChildren & { value: { level?: number } }) => (
      <li className={cn(level && level > 1 && subLevelListItemStyle, "flex items-start gap-2xs")}>
        <span className="flex shrink-0 items-center py-2xs">{checkIcon}</span>
        <span className="pt-0.5">{children}</span>
      </li>
    ),
  } as ListLevelRenderMap;
};

const types = (): BlockTypeRendererMap => {
  return {
    "callToAction.block": ({ value }) => {
      return <CallToActionBlock {...value} />;
    },
    figure: ({ value }) => {
      const { mediaType, image, illustration } = value ?? {};

      if (mediaType === "illustration" && illustration) {
        return (
          <div className="aspect-3/2 rounded bg-container-secondary flex items-end justify-center">
            <Illustration name={illustration as IllustrationName} className="w-1/3 h-auto" />
          </div>
        );
      }

      // Default to image (includes mediaType === "image" and legacy data without mediaType)
      if (image) {
        return <Img {...image} sizes={{ md: "full" }} showCaption />;
      }

      return null;
    },
    "accordions.block": ({ value }) => {
      return <AccordionsBlock accordions={value?.accordions} />;
    },
    "imageAndText.block": ({ value }) => {
      return <ImageAndTextBlock {...value} />;
    },
  };
};

const components = (options: PortableTextOptions) => {
  return {
    marks: marks(options),
    block: block(options),
    list: list(options),
    listItem: listItem(options),
    types: types(),
  };
};

export const PortableText = (props: {
  content: NonNullable<FullPortableTextQueryTypeResult>["content"] | null;
  className?: string;
  options?: PortableTextOptions;
}) => {
  const { content, className, options = {} } = props;

  if (!content) return null;

  return (
    <div className={cn(className)}>
      {/* biome-ignore lint/suspicious/noExplicitAny: content type matches portable text structure but generated types may lack _type */}
      <PortableTextComponent components={components(options)} value={content as any} />
    </div>
  );
};
