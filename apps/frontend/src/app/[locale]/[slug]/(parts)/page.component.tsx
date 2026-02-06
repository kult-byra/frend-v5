import { PageBuilder } from "@/components/page-builder/page-builder.component";
import type { PageQueryResult } from "@/sanity-types";

type PageProps = {
  pageBuilder: NonNullable<PageQueryResult>["pageBuilder"];
};

export const Page = ({ pageBuilder }: PageProps) => {
  if (!pageBuilder) return null;

  return <PageBuilder pageBuilder={pageBuilder} />;
};
