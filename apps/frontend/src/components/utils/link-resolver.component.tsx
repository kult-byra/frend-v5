import { resolvePath } from "@workspace/routing/src/resolve-path";
import Link from "next/link";
import type {
  DownloadLinkProps,
  ExternalLinkProps,
  InternalLinkProps,
  LinkProps,
} from "@/server/queries/utils/links.query";
import { cn } from "@/utils/cn.util";

export type LinkResolverProps = Omit<React.ComponentProps<"a">, "href" | "title"> & {
  openBlank?: boolean;
};

export const LinkResolver = (props: LinkResolverProps & LinkProps) => {
  const { children, linkType } = props;

  switch (linkType) {
    case "internal":
      return <InternalLink {...props}>{children}</InternalLink>;
    /* case "anchor":
      return <AnchorLink {...props}>{children}</AnchorLink>; */
    case "external":
    case "download":
      return <ExternalLink {...props}>{children}</ExternalLink>;
    default:
      return <pre>linkType {linkType} missing</pre>;
  }
};

const InternalLink = ({
  _type,
  slug,
  className,
  children,
  onClick,
  openBlank,
  ref,
}: InternalLinkProps & LinkResolverProps) => {
  if (!_type && !slug) return <>{children}</>;

  return (
    <Link
      rel={openBlank ? "noreferrer" : undefined}
      target={openBlank ? "_blank" : undefined}
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={resolvePath(_type, slug ? { slug } : {})}
      className={cn("group", className)}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

const ExternalLink = ({
  url,
  className,
  children,
  openBlank,
  ref,
}: (ExternalLinkProps | DownloadLinkProps) & LinkResolverProps) => {
  if (!url) return <>{children}</>;

  const isType = (type: string) => url?.startsWith(type);
  const breakLink =
    isType("mailto") || (typeof children === "string" && children?.startsWith("http"));

  if (isType("tel")) {
    url = url.replaceAll(" ", "");
  }

  return (
    <a
      ref={ref}
      href={url}
      rel={openBlank ? "noreferrer" : undefined}
      target={openBlank ? "_blank" : undefined}
      className={cn("group", className, breakLink && "break-all")}
    >
      {children}
    </a>
  );
};

LinkResolver.displayName = "LinkResolver";
