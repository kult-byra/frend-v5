import { Skeleton } from "@/components/ui/skeleton";
import { ARTICLES_PER_PAGE } from "@/lib/search-params/articles.search-params";

export const ArticleArchiveSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sm">
      {Array.from({ length: ARTICLES_PER_PAGE }).map((_, i) => (
        <div key={`skeleton-${i.toString()}`} className="space-y-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
};
