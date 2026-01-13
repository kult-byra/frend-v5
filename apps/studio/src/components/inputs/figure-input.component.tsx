"use client";

import { Box, Button, Card, Dialog, Flex, Stack, Text, TextInput, useToast } from "@sanity/ui";
import { defineQuery } from "groq";
import { Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  FormField,
  type ImageValue,
  type ObjectInputProps,
  type SanityClient,
  set,
  useClient,
} from "sanity";
import { env } from "@/env";
import { sleep } from "@/utils/sleep.util";

type Value = ImageValue & { changed?: boolean };

export type FigureInputProps = ObjectInputProps<ImageValue> & {
  value: Value;
};

type SanityImage = {
  title?: string;
  altText?: string;
  description?: string;
};

export const FIGURE_FIELDS = [
  {
    name: "title" as const,
    title: "Tittel",
  },
  {
    name: "altText" as const,
    title: "Alt-tekst",
    description: "Beskriv bildets innhold. Viktig for SEO og tilgjengelighet.",
    required: true,
  },
  {
    name: "description" as const,
    title: "Beskrivelse/bildetekst",
  },
];

export const sanityImageMetaQuery = defineQuery(`*[_id == $id][0]
{ title, altText, description }`);

export const FigureInput = (props: FigureInputProps) => {
  return (
    <Stack>
      {props.renderDefault(props)}

      <ImageMetadata {...props} />
    </Stack>
  );
};

const ImageMetadata = (props: FigureInputProps) => {
  const { value, onChange } = props;

  const imageId = value?.asset?._ref;

  const client = useClient({ apiVersion: env.SANITY_STUDIO_API_VERSION });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const onClose = useCallback(() => setIsDialogOpen(false), []);
  const onOpen = useCallback(() => setIsDialogOpen(true), []);

  const [sanityImage, setSanityImage] = useState<SanityImage | null>(null);
  const hasAltText = !sanityImage || Boolean(sanityImage.altText);

  useEffect(() => {
    // Fetch image metadata from Sanity and listen for changes
    // biome-ignore lint/suspicious/noExplicitAny: Subscription type is not exported from rxjs
    let subscription: any = null;

    const params = { id: imageId };

    const fetchSanityImage = async (isListening = false) => {
      if (isListening) {
        await sleep(1500);
      }

      const data = await client.fetch<SanityImage | undefined>(sanityImageMetaQuery, params);

      setSanityImage(data ?? {});
    };

    const listen = () => {
      subscription = client
        .listen(sanityImageMetaQuery, params, { visibility: "query" })
        .subscribe(() => fetchSanityImage(true));
    };

    if (imageId) {
      fetchSanityImage().then(listen);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [imageId, client]);

  if (!imageId) return null;

  return (
    <Card
      tone={!hasAltText ? "critical" : "transparent"}
      paddingLeft={3}
      paddingRight={2}
      paddingBottom={3}
      radius={2}
      className="rounded-t-none"
    >
      <Flex gap={3}>
        {/* METADATA PREVIEW */}
        <Box flex={1} paddingTop={3}>
          <Stack space={3}>
            {FIGURE_FIELDS.map((field) => (
              <Text key={field.name} muted size={1}>
                <span>
                  <span style={{ fontWeight: 500 }}>{field.title}: </span>
                  {sanityImage?.[field.name]}
                </span>
              </Text>
            ))}
          </Stack>
        </Box>

        {/* EDIT BUTTON */}
        <Box paddingTop={2}>
          <Button
            mode={!hasAltText ? "default" : "ghost"}
            text="Rediger metadata"
            icon={Pencil}
            onClick={onOpen}
            disabled={!imageId}
            fontSize={1}
            padding={2}
            space={2}
            tone={!hasAltText ? "critical" : "default"}
          />
        </Box>
      </Flex>

      {sanityImage && isDialogOpen && (
        <EditMetadataDialog
          imageId={imageId}
          value={value}
          sanityImage={sanityImage}
          client={client}
          onChange={onChange}
          onClose={onClose}
        />
      )}
    </Card>
  );
};

const EditMetadataDialog = (props: {
  imageId: string;
  value: Value;
  sanityImage: SanityImage;
  client: SanityClient;
  onChange: FigureInputProps["onChange"];
  onClose: () => void;
}) => {
  const { sanityImage, client, imageId, onChange, value, onClose } = props;

  const [internalSanityImage, setInternalSanityImage] = useState<SanityImage>(sanityImage);

  const [isSaving, setIsSaving] = useState(false);

  const toast = useToast();

  const handlePatchSanityImage = async () => {
    const sanityImageEntries = Object.entries(internalSanityImage);

    const valuesToSet = sanityImageEntries.reduce(
      (acc, [key, value]) => {
        if (value && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const valuesToUnset = sanityImageEntries.reduce((acc, [key, value]) => {
      if (!value || value === "") {
        acc.push(key);
      }
      return acc;
    }, [] as string[]);

    setIsSaving(true);

    if (imageId) {
      await client.patch(imageId).set(valuesToSet).unset(valuesToUnset).commit();

      // Toggle "changed" to trigger re-validation of field
      onChange(set({ ...value, changed: !value?.changed }));

      toast.push({
        status: "success",
        title: "Bildets metadata ble oppdatert",
      });
    }

    setIsSaving(false);

    onClose();
  };

  const fieldsToValidate = FIGURE_FIELDS.reduce(
    (acc, field) => {
      if (field.required) {
        acc[field.name] = false;
      }
      return acc;
    },
    {} as Record<string, boolean>,
  );

  const [validationStatus, setValidationStatus] = useState(fieldsToValidate);

  const handleInputChange = useCallback(
    (fieldName: string, value: string) => {
      setInternalSanityImage((prevInternalSanityImage) => ({
        ...prevInternalSanityImage,
        [fieldName]: value,
      }));

      const isFieldToValidate = fieldsToValidate[fieldName] !== undefined;

      if (isFieldToValidate) {
        setValidationStatus((prevValidationStatus) => ({
          ...prevValidationStatus,
          // biome-ignore lint/complexity/noUselessTernary: This is not a useless ternary
          [fieldName]: value !== "" ? true : false,
        }));
      }
    },
    [fieldsToValidate],
  );

  return (
    <Dialog
      header="Rediger metadata"
      id="dialog-image-defaults"
      onClose={onClose}
      zOffset={1000}
      width={1}
      footer={
        <Flex padding={4} gap={2}>
          <Box flex={1}>
            <Button
              mode="ghost"
              text="Avbryt"
              className="w-full"
              onClick={onClose}
              disabled={isSaving}
            />
          </Box>
          <Box flex={1}>
            <Button
              tone="positive"
              text={isSaving ? "Lagrer…" : "Lagre"}
              className="w-full"
              onClick={handlePatchSanityImage}
              disabled={isSaving || !Object.values(validationStatus).every((isValid) => isValid)}
            />
          </Box>
        </Flex>
      }
    >
      <Box padding={4}>
        <Stack space={5}>
          {FIGURE_FIELDS.map((field) => (
            <Stack key={field.name} space={3} as="label">
              <FormField
                title={field.required ? `${field.title} *` : field.title}
                description={field.description}
              >
                <TextInput
                  onChange={(event) => handleInputChange(field.name, event.currentTarget.value)}
                  value={internalSanityImage[field.name]}
                  required={field.required}
                />
              </FormField>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Dialog>
  );
};
