import { Palette } from "lucide-react";
import styled from "styled-components";
import { env } from "@/env";

const StyledIframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
`;

export const brandGuidelinesTool = ({
  locale,
  type,
}: {
  locale?: "en" | "no";
  type?: "brand" | "visualIdentity";
}) => {
  if (!env.SANITY_STUDIO_BRAND_GUIDELINES_URL) return null;

  const title =
    locale === "en"
      ? { brand: "Brand guidelines", visualIdentity: "Brand guidelines" }
      : { brand: "Merkevarehåndbok", visualIdentity: "Designmanual" };

  return {
    title: title[type ?? "brand"],
    name: "brand-guidelines",
    icon: Palette,
    component: () => (
      <StyledIframe
        id="brand-guidelines"
        src={env.SANITY_STUDIO_BRAND_GUIDELINES_URL}
        title={title[type ?? "brand"]}
      />
    ),
  };
};
