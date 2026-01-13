import type {
  PortableTextListComponent,
  PortableTextListItemComponent,
  PortableTextMarkComponent,
} from "@portabletext/react";
import type { _fullPortableTextQueryTypeResult } from "@/sanity-types";

type NonNullableContent = NonNullable<NonNullable<_fullPortableTextQueryTypeResult>["content"]>;

// Setup block types
type PortableTextBlockTypes = Exclude<NonNullableContent[number], { _type: "block" }>;

export type PortableTextBlockTypeUnion = PortableTextBlockTypes["_type"];

export type PTBlockProps<BlockType extends PortableTextBlockTypeUnion> = Extract<
  PortableTextBlockTypes,
  { _type: BlockType }
>;

// Create a mapping from _type strings to their corresponding types
type BlockTypeMap = {
  [T in PortableTextBlockTypes as T["_type"]]: T;
};

// Define the renderer map using the inferred BlockTypeMap
export type BlockTypeRendererMap = {
  [K in keyof BlockTypeMap]: (props: { value: BlockTypeMap[K] }) => React.ReactNode;
};

type PortableTextBlockType = Extract<NonNullableContent[number], { _type: "block" }>;

// Setup block styles map
type BlockStyles = NonNullable<PortableTextBlockType["style"]>;

export type BlockStylesRendererMap = {
  [K in BlockStyles]: (props: { children?: React.ReactNode }) => React.ReactNode;
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
