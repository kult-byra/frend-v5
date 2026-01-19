import { PageBuilder } from "@/components/page-builder/page-builder.component";
import type { PageQueryResult } from "@/sanity-types";

export const Page = (props: Omit<NonNullable<PageQueryResult>, "metadata">) => {
  const { pageBuilder } = props;

  return <>{pageBuilder && <PageBuilder pageBuilder={pageBuilder} />}</>;
};
