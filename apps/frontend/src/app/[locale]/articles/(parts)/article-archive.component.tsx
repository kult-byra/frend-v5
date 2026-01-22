import { Pagination } from "@/components/pagination.component";
import { ArticleTeaser } from "@/components/teasers/article.teaser";
import { ARTICLES_PER_PAGE } from "@/lib/search-params/articles.search-params";
import {
  type ArticleArchivePaginatedResult,
  articleArchivePaginatedQuery,
} from "@/server/queries/documents/article-archive.query";
import { sanityFetch } from "@/server/sanity/sanity-live";

type Props = {
  initialPage: number;
  locale: string;
};

export const ArticleArchive = async ({ initialPage, locale }: Props) => {
  // TODO: Enable when next-sanity supports cache components
  // "use cache";
  // cacheLife("hours");

  const start = (initialPage - 1) * ARTICLES_PER_PAGE;
  const end = start + ARTICLES_PER_PAGE;

  // Type assertion needed because sanity-typegen cannot infer types from nested subqueries
  // ArticleArchivePaginatedResult is derived from ArticleTeaserProps (typegen-generated)
  const { data } = (await sanityFetch({
    query: articleArchivePaginatedQuery,
    params: {
      start,
      end,
      locale,
    },
    tags: ["newsArticle"],
  })) as { data: ArticleArchivePaginatedResult };

  const { articles, total } = data;
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
