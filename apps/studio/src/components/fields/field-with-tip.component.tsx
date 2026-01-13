import {
  Box,
  Button,
  Card,
  type CardTone,
  Flex,
  Popover,
  Stack,
  Text,
  useClickOutsideEvent,
} from "@sanity/ui";
import { CircleHelp, Dot, type LucideIcon } from "lucide-react";
import { type ReactNode, useCallback, useRef, useState } from "react";
import type { FieldProps } from "sanity";

export type SchemaTip = {
  title: string;
  description?: ReactNode;
  examples?: string[];
  tone?: Exclude<CardTone, "primary" | "inherit" | "default" | "transparent">;
  icon?: LucideIcon;
};

export const FieldWithTip = (props: FieldProps) => {
  const { title: fieldTitle, schemaType } = props;

  const tip = schemaType?.options?.tip as SchemaTip;

  const { icon: Icon = CircleHelp, tone = "positive", title, description, examples } = tip;
  const AdjustedIcon = () => <Icon className="!m-0 !mt-[-0.15em]" />;

  const [isOpen, setIsOpen] = useState(false);

  const boundaryElementRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutsideEvent(handleClickOutside, () => [boundaryElementRef.current]);

  return (
    <Stack>
      {props.renderDefault({
        ...props,
        title: (
          <Flex gap={2}>
            {fieldTitle}

            <Popover
              ref={boundaryElementRef}
              content={
                <Card tone={tone} radius={3} padding={4}>
                  <Stack space={3}>
                    <Flex gap={1}>
                      <Text size={1}>
                        <AdjustedIcon />
                      </Text>

                      <Text size={1} weight="semibold">
                        {title}
                      </Text>
                    </Flex>

                    {description && <Text size={1}>{description}</Text>}

                    {examples && examples?.length > 0 && (
                      <Card tone={tone} shadow={1} radius={3} marginTop={2}>
                        <Box padding={3}>
                          <Text size={0} weight="medium">
                            {examples.length > 1 ? "Eksempler" : "Eksempel"}
                          </Text>
                        </Box>

                        <div
                          style={{
                            borderTop: "1px solid var(--card-shadow-outline-color)",
                            opacity: 0.3,
                          }}
                        />

                        <Box padding={3}>
                          <Stack space={2}>
                            {examples.map((example) => (
                              <Text key={example} size={0}>
                                {examples?.length > 1 && <Dot />} {example}
                              </Text>
                            ))}
                          </Stack>
                        </Box>
                      </Card>
                    )}
                  </Stack>
                </Card>
              }
              portal
              constrainSize
              open={isOpen}
            >
              <Button
                mode="ghost"
                padding={1}
                space={1}
                fontSize={0}
                text={tip.title}
                icon={AdjustedIcon}
                tone={tone}
                onClick={() => setIsOpen(!isOpen)}
              />
            </Popover>
          </Flex>
          // biome-ignore lint/suspicious/noExplicitAny: Valid with react component even though Sanity complains
        ) as any,
      })}
    </Stack>
  );
};
