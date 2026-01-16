import { PortableText as PortableTextComponent } from "@portabletext/react";
import type { PropsWithChildren } from "react";
import { CallToActionBlock } from "@/components/blocks/call-to-action.block.component";
import {
  Heading,
  type HeadingLevel,
  type HeadingSize,
} from "@/components/layout/heading.component";
import { Button } from "@/components/ui/button";
import { Img } from "@/components/utils/img.component";
import { LinkResolver } from "@/components/utils/link-resolver.component";
import type { _fullPortableTextQueryTypeResult } from "@/sanity-types";
import { cn } from "@/utils/cn.util";
import { ImageAndTextBlock } from "../blocks/image-and-text.block.component";
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

  const headingStyle = "mb-[0.5em] mt-[2em] first:mt-0 last:mb-0";

  return {
    h2: ({ children }) => (
      <Heading level={topHLevel} size={topHSize ?? topHLevel} className={headingStyle}>
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading
        level={(topHLevel + 1) as HeadingLevel}
        size={topHSize ? ((topHSize + 1) as HeadingSize) : ((topHLevel + 1) as HeadingSize)}
        className={headingStyle}
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
        <Button asChild variant="link">
          <LinkResolver linkType="external" url={url}>
            {children}
          </LinkResolver>
        </Button>
      );
    },

    internalLinkObject: ({ children, value }) => {
      const { internalLink } = value ?? {};

      if (!internalLink?._type) return <>{children}</>;

      return (
        <Button asChild variant="link">
          <LinkResolver {...internalLink} linkType="internal">
            {children}
          </LinkResolver>
        </Button>
      );
    },

    downloadLinkObject: ({ children, value }) => {
      const { url } = value ?? {};

      if (!url) return <>{children}</>;

      return (
        <Button asChild variant="link">
          <LinkResolver linkType="download" url={url}>
            {children}
          </LinkResolver>
        </Button>
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

  return {
    bullet: ({ children }: PropsWithChildren) => (
      <ul className={cn(pSize, listStyle, "list-disc")}>{children}</ul>
    ),
    number: ({ children }: PropsWithChildren) => (
      <ol className={cn(pSize, listStyle, "list-decimal")}>{children}</ol>
    ),
    dash: ({ children }: PropsWithChildren) => (
      <ul className={cn(pSize, listStyle, "list-none")}>
        {children}
      </ul>
    ),
    check: ({ children }: PropsWithChildren) => (
      <ul className={cn(pSize, listStyle, "list-none")}>
        {children}
      </ul>
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
      <li className={cn(level && level > 1 && subLevelListItemStyle, "before:content-['-'] before:mr-2")}>
        {children}
      </li>
    ),
    check: ({ children, value: { level } }: PropsWithChildren & { value: { level?: number } }) => (
      <li className={cn(level && level > 1 && subLevelListItemStyle, "flex items-start gap-2")}>
        <span className="mt-0.5 flex-shrink-0">{checkIcon}</span>
        <span>{children}</span>
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
      return <Img {...value} sizes={{ md: "full" }} showCaption />;
    },
    "accordion.block": () => {
      return <p>Implement me</p>;
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
  content: NonNullable<_fullPortableTextQueryTypeResult>["content"] | null;
  className?: string;
  options?: PortableTextOptions;
}) => {
  const { content, className, options = {} } = props;

  if (!content) return null;

  return (
    <div className={cn(className)}>
      <PortableTextComponent components={components(options)} value={content} />
    </div>
  );
};
