import type { ArticleTeaserProps } from "@/server/queries/teasers/article-teaser.query";
import { H2 } from "../layout/heading.component";
import { LinkResolver } from "../utils/link-resolver.component";

export const ArticleTeaser = (props: ArticleTeaserProps) => {
  const { title, slug } = props;
  return (
    <LinkResolver linkType="internal" slug={slug} _type="article">
      <H2>{title}</H2>
    </LinkResolver>
  );
};
