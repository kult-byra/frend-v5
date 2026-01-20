import { Box, Button, Card, Flex, Text, useToast } from "@sanity/ui";
import type { LinkableType } from "@workspace/routing/src/linkable-types";
import { resolvePath } from "@workspace/routing/src/resolve-path";
import type { Locale } from "@workspace/routing/src/route.config";
import { Copy, SquareArrowOutUpRight } from "lucide-react";
import { type SlugInputProps, useFormValue } from "sanity";
import { env } from "@/env";
import { copyToClipboard } from "@/utils/copy-to-clipboard.util";

export const SlugInput = (
  props: SlugInputProps & {
    isStatic?: boolean;
  },
) => {
  const { value, isStatic } = props;

  const toast = useToast();

  const documentType = useFormValue(["_type"]) as string;
  const language = useFormValue(["language"]) as Locale | undefined;

  const path = resolvePath(
    documentType as LinkableType,
    value?.current ? { slug: value.current } : {},
    language,
  );

  const url = `${env.SANITY_STUDIO_FRONTEND_URL}${language === "en" ? "/en" : ""}${path}`;

  const routePath = resolvePath(documentType as LinkableType, { slug: "" }, language);

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
