import { WarningOutlineIcon } from "@sanity/icons";
import { Card, Flex, Stack, Text } from "@sanity/ui";
import type { InputProps, ObjectInputProps } from "sanity";
import { I18N_SCHEMA_TYPES } from "@/utils/i18n-schema-types.util";

/**
 * Form input wrapper that shows a warning banner at the top of i18n documents
 * when no language is set.
 *
 * This component intercepts the root document input and adds a banner above
 * the default form rendering.
 */
export const MissingLanguageInput = (props: InputProps) => {
  // Only apply to root document input (id === "root") for i18n document types
  const isRootDocument =
    props.id === "root" && props.schemaType.type?.name === "document";
  const isI18nType = (I18N_SCHEMA_TYPES as readonly string[]).includes(props.schemaType.name);

  if (!isRootDocument || !isI18nType) {
    return props.renderDefault(props);
  }

  // Check if language is set on the document
  const objectProps = props as ObjectInputProps;
  const value = objectProps.value as { language?: string } | undefined;
  const hasLanguage = Boolean(value?.language);

  if (hasLanguage) {
    return props.renderDefault(props);
  }

  return (
    <Stack space={4}>
      <Card padding={4} tone="critical" border radius={2}>
        <Flex align="center" gap={3}>
          <Text size={2}>
            <WarningOutlineIcon />
          </Text>
          <Stack space={2}>
            <Text size={1} weight="semibold">
              No language set
            </Text>
            <Text size={1} muted>
              This document has no language assigned. Click the "Translations"
              button in the top right corner to select a language.
            </Text>
          </Stack>
        </Flex>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  );
};
