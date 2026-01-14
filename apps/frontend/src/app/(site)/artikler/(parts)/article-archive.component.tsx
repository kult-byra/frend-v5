import { Pagination } from "@/components/pagination.component";
import { ArticleTeaser } from "@/components/teasers/article.teaser";
import { ARTICLES_PER_PAGE } from "@/lib/search-params/articles.search-params";
import type { ArticleArchivePaginatedQueryResult } from "@/sanity-types";
import { articleArchivePaginatedQuery } from "@/server/queries/documents/article-archive.query";
import { sanityFetch } from "@/server/sanity/sanity-live";

type Props = {
  initialPage: number;
};

export const ArticleArchive = async ({ initialPage }: Props) => {
  // TODO: Enable when next-sanity supports cache components
  // "use cache";
  // cacheLife("hours");

  const start = (initialPage - 1) * ARTICLES_PER_PAGE;
  const end = start + ARTICLES_PER_PAGE;

  const { data } = await sanityFetch({
    query: articleArchivePaginatedQuery,
    params: {
      start,
      end,
    },
    tags: ["newsArticle"],
  });

  const { articles, total } = data as NonNullable<ArticleArchivePaginatedQueryResult>;
  const totalPages = Math.ceil(total / ARTICLES_PER_PAGE);

  return (
    <>
      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleTeaser key={article._id} {...article} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Ingen artikler funnet.</p>
      )}

      <Pagination currentPage={initialPage} totalPages={totalPages} basePath="/artikler" />
    </>
  );
};
