import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export const Pagination = ({ currentPage, totalPages, basePath }: Props) => {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`);

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
          rel="prev"
        >
          Forrige
        </Link>
      )}

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index.toString()}`} className="px-2" aria-hidden="true">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={cn(
                "min-w-[2.5rem] px-3 py-2 border rounded-md text-center transition-colors",
                page === currentPage
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-accent",
              )}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          ),
        )}
      </div>

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
          rel="next"
        >
          Neste
        </Link>
      )}
    </nav>
  );
};
