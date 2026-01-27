import { PortableText } from "@/components/portable-text/portable-text.component";
import type { CaseStudyQueryResult } from "@/sanity-types";

type Props = {
  summary: NonNullable<CaseStudyQueryResult>["summary"];
};

export const Summary = ({ summary }: Props) => {
  if (!summary?.length) return null;

  return (
    <div className="flex flex-col gap-xs rounded-3xs bg-container-tertiary-3 p-xs">
      <div className="flex max-w-[720px] flex-col gap-2xs">
        <p className="text-body-title text-text-primary">Summary</p>
        <PortableText content={summary} className="text-body-large text-text-primary" />
      </div>
    </div>
  );
};
