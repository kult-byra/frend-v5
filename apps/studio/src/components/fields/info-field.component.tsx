"use client";

import { Card, Flex, Stack, Text } from "@sanity/ui";
import { Check, CircleAlert, Info, TriangleAlert } from "lucide-react";
import type { InfoFieldDefinition } from "@/schemas/generator-fields/info.field";

const icons = {
  transparent: Info,
  positive: Check,
  caution: CircleAlert,
  critical: TriangleAlert,
} as const;

export const InfoField = (props: InfoFieldDefinition) => {
  const {
    tone = "transparent",
    title,
    description,
    icon,
  } = props as {
    tone: keyof typeof icons;
    title?: string;
    description?: string;
    icon?: React.ComponentType;
  };

  const Icon = icon ?? icons[tone];

  return (
    <Card tone={tone} padding={4} radius={2} shadow={1}>
      <Flex gap={3}>
        <Text size={2}>
          <Icon />
        </Text>

        <Stack space={3}>
          {title && (
            <Text size={1} weight="semibold">
              {title}
            </Text>
          )}

          {description && <Text size={1}>{description}</Text>}
        </Stack>
      </Flex>
    </Card>
  );
};
