import { Box, Flex, Label } from "@sanity/ui";
import type { PreviewProps } from "sanity";

export const PageBuilderBlockPreview = (props: PreviewProps) => {
  const { schemaType } = props;
  const { title } = schemaType ?? {};

  const maxLength = 25;

  return (
    <Flex align="center">
      <Box flex={1}>{props.renderDefault(props)}</Box>

      <Label size={1} muted>
        {title?.substring(0, maxLength)}
        {title && title?.length > maxLength ? "…" : ""}
      </Label>
    </Flex>
  );
};
