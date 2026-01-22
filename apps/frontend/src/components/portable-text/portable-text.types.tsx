import type {
  PortableTextListComponent,
  PortableTextListItemComponent,
  PortableTextMarkComponent,
} from "@portabletext/react";
import type { FullPortableTextQueryTypeResult } from "@/sanity-types";

type NonNullableContent = NonNullable<NonNullable<FullPortableTextQueryTypeResult>["content"]>;

// Block types for custom renderers - using Record since the generated types
// may not include all block types depending on actual content in the database
// biome-ignore lint/suspicious/noExplicitAny: custom block value types vary
export type BlockTypeRendererMap = Record<string, (props: { value: any }) => React.ReactNode>;

type PortableTextBlockType = Extract<NonNullableContent[number], { _type: "block" }>;

// Setup block styles map
type BlockStyles = NonNullable<PortableTextBlockType["style"]>;

export type BlockStylesRendererMap = {
  [K in BlockStyles]: (props: {
    children?: React.ReactNode;
    value?: { _key?: string };
  }) => React.ReactNode;
};

// Extract MarkDef Types
type MarkDef = NonNullable<PortableTextBlockType["markDefs"]>[number];
type MarkDefTypes = MarkDef["_type"];

type DeflessMarkType<K extends string> = {
  _type: K;
};

type MarkDefOrDefless<K extends string> = K extends MarkDefTypes
  ? Extract<MarkDef, { _type: K }>
  : DeflessMarkType<K>;

export type BlockMarkRendererMap<DeflessMarks extends string> = {
  [K in MarkDefTypes | DeflessMarks]: PortableTextMarkComponent<MarkDefOrDefless<K>>;
};

// List style types
type ListStyle = NonNullable<PortableTextBlockType["listItem"]>;

export type ListStyleRendererMap = {
  [K in ListStyle]: PortableTextListComponent;
};

export type ListLevelRenderMap = {
  [K in ListStyle]: PortableTextListItemComponent;
};
