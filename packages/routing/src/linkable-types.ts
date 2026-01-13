import type { InternalLink, internalGroqTypeReferenceTo } from "@workspace/sanity-types";

type InternalGroqTypeReferenceTo = typeof internalGroqTypeReferenceTo;

export type LinkableType = NonNullable<
  Pick<InternalLink, InternalGroqTypeReferenceTo>[InternalGroqTypeReferenceTo]
>;
