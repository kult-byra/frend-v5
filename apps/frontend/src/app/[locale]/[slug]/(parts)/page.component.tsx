import { PageBuilder } from "@/components/page-builder/page-builder.component";
import type { PageQueryResult } from "@/sanity-types";

type PageProps = {
  pageBuilder: NonNullable<PageQueryResult>["pageBuilder"];
};

export const Page = (props: PageProps) => {
  const { pageBuilder } = props;

  return <>{pageBuilder && <PageBuilder pageBuilder={pageBuilder} />}</>;
};
