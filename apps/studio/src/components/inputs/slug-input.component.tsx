import { Box, Button, Card, Flex, Text, useToast } from "@sanity/ui";
import type { LinkableType } from "@workspace/routing/src/linkable-types";
import { resolvePath } from "@workspace/routing/src/resolve-path";
import type { Locale } from "@workspace/routing/src/route.config";
import { Copy, SquareArrowOutUpRight } from "lucide-react";
import { type SlugInputProps, useFormValue } from "sanity";
import { env } from "@/env";
import { copyToClipboard } from "@/utils/copy-to-clipboard.util";

/**
 * Detects the locale from field name suffix for field-level translation schemas.
 * Falls back to document-level language field.
 */
const useLocaleFromField = (fieldName: string): Locale | undefined => {
  const documentLanguage = useFormValue(["language"]) as Locale | undefined;

  // Check for field-level translation suffix (_no or _en)
  if (fieldName.endsWith("_no")) return "no";
  if (fieldName.endsWith("_en")) return "en";

  // Fall back to document-level language
  return documentLanguage;
};

export const SlugInput = (
  props: SlugInputProps & {
    isStatic?: boolean;
  },
) => {
  const { value, isStatic } = props;

  const toast = useToast();

  const documentType = useFormValue(["_type"]) as string;
  const fieldName = props.schemaType.name;
  const language = useLocaleFromField(fieldName);

  // For subService, get the parent service's slug
  const parentSlugNo = useFormValue(["service", "slug_no", "current"]) as string | undefined;
  const parentSlugEn = useFormValue(["service", "slug_en", "current"]) as string | undefined;

  // Determine the parent slug based on locale
  const parentSlug = language === "en" ? parentSlugEn || parentSlugNo : parentSlugNo;

  // Build the params object based on document type
  const getRouteParams = () => {
    const params: Record<string, string> = {};
    if (value?.current) {
      params.slug = value.current;
    }
    if (documentType === "subService" && parentSlug) {
      params.parentSlug = parentSlug;
    }
    return params;
  };

  // Default to Norwegian if no language detected
  const effectiveLocale: Locale = language ?? "no";

  const path = resolvePath(documentType as LinkableType, getRouteParams(), effectiveLocale);

  const url = `${env.SANITY_STUDIO_FRONTEND_URL}${effectiveLocale === "en" ? "/en" : ""}${path}`;

  // Build the route path prefix (without the actual slug value)
  const getRoutePrefixParams = () => {
    const params: Record<string, string> = { slug: "" };
    if (documentType === "subService") {
      params.parentSlug = parentSlug || "[tjeneste]";
    }
    return params;
  };

  const routePath = resolvePath(
    documentType as LinkableType,
    getRoutePrefixParams(),
    effectiveLocale,
  );

  return (
    <Flex gap={1} className="slug-input-container">
      <Flex flex={1} className="slug-input-flex">
        <Card
          tone="transparent"
          paddingX={3}
          radius={2}
          border
          borderRight={Boolean(isStatic)}
          display="flex"
          className={`slug-path-card ${isStatic ? "static-path" : "dynamic-path"}`}
          width="fill"
        >
          <Text muted>{routePath}</Text>
        </Card>

        {!isStatic && props.renderDefault(props)}
      </Flex>

      <Button
        text="Kopiér"
        icon={Copy}
        mode="ghost"
        tone="positive"
        onClick={() => {
          copyToClipboard(url);
          toast.push({
            status: "info",
            title: <OpenLink url={url} />,
          });
        }}
        disabled={!isStatic && !value?.current}
        className="copy-button"
      />
    </Flex>
  );
};

const OpenLink = (props: { url: string }) => {
  const { url } = props;

  return (
    <Flex width="fill" justify="space-between" align="center" className="open-link-container">
      <Box flex={1}>
        <Text size={1} weight="medium">
          Link kopiert!
        </Text>
      </Box>

      <a href={url} target="_blank" rel="noopener noreferrer" className="open-link">
        <Button
          as="div"
          text="Åpne i ny fane"
          fontSize={1}
          padding={2}
          tone="primary"
          iconRight={SquareArrowOutUpRight}
          mode="ghost"
          className="open-link-button"
        />
      </a>
    </Flex>
  );
};
