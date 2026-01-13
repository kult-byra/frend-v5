import { Container } from "@/components/layout/container.component";
import { H1, H2 } from "@/components/layout/heading.component";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { LinkResolver } from "@/components/utils/link-resolver.component";
import type { LinkableType } from "@/custom.types";
import type { SitemapQueryResult } from "@/sanity-types";
import { fetchSitemap } from "@/server/queries/paths/sitemap.query";
import { createPage } from "@/utils/create-page.util";

type GroupedDataItem = {
  title: string;
  pages: SitemapQueryResult["pages"];
};

const { Page, generateMetadata } = createPage({
  loader: async () => {
    const data = await fetchSitemap();

    const { pages, frontPage } = data ?? {};
    const allPages = [...pages, frontPage].filter(Boolean);

    const groupedData = allPages
      .reduce((acc, page) => {
        const match = page.title?.match(/[a-zA-ZæøåÆØÅ0-9]/);
        const firstCharacter = match ? match[0] : "";

        const isNumeric = /^[+-]?\d+(\.\d+)?$/.test(firstCharacter);
        const numericGroupTitle = "0-9";

        const groupTitle = isNumeric ? numericGroupTitle : firstCharacter;

        const existingGroup = acc.find((group) => group.title === groupTitle);

        if (existingGroup) {
          existingGroup.pages.push(page);
        } else {
          acc.push({
            title: groupTitle,
            pages: [page],
          });
        }

        return acc;
      }, [] as GroupedDataItem[])
      .sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });

    return groupedData;
  },

  metadata: async () => {
    return {
      title: "Alt innhold fra A til Å",
    };
  },

  component: ({ data }) => {
    return (
      <Container className="grid gap-y-16 mb-16 md:gap-y-20 md:mb-20">
        <H1>Alt innhold fra A til Å</H1>

        <Pagination className="justify-start">
          <PaginationContent>
            {data.map((group) => (
              <PaginationItem key={group.title}>
                <PaginationLink href={`#${group.title}`}>{group.title}</PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>

        {data.map((group) => (
          <div
            key={group.title}
            id={group.title}
            className="grid grid-cols-3 border-t border-slate-200 items-start"
          >
            <H2 className="py-2">{group.title}</H2>

            <ul className="col-span-2">
              {group.pages.map((page) => (
                <li key={page._id}>
                  {/* @ts-ignore i cba */}
                  <LinkResolver
                    linkType="internal"
                    {...(page.slug && { slug: page.slug })}
                    {...(page._type && { _type: page._type as LinkableType })}
                    className="block py-2 transition-colors border-b border-slate-200 hover:border-slate-800"
                  >
                    {page.title}
                  </LinkResolver>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
    );
  },
});

export default Page;

export { generateMetadata };
