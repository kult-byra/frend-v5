import { Container } from "@/components/layout/container.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import type { SiteSettingsQueryResult } from "@/sanity-types";

export const Banner = (props: SiteSettingsQueryResult) => {
  if (!props || !("bannerContent" in props)) return null;

  const { bannerContent } = props;

  return (
    <Container
      fullWidth
      aria-label="Viktig melding"
      className="relative z-50 py-2xs bg-slate-800/95 text-white flex justify-center text-center"
    >
      <PortableText content={bannerContent} options={{ pSize: "text-xs" }} />
    </Container>
  );
};
