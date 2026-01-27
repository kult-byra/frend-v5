import type { PageBuilderTypegenQueryResult } from "@/sanity-types";

export type PageBuilderType = NonNullable<PageBuilderTypegenQueryResult>;

export type SingePageBuilderBlockType = NonNullable<PageBuilderType>[number];

type DistributeIntersection<U, T> = U extends U ? U & T : never;

type PageBuilderBlocks = NonNullable<PageBuilderType>;

// Example to show add options
type BlockOptions = {
  isFirstSection?: boolean | undefined;
  layout?: "default" | "fullWidth" | undefined;
};

export type PageBuilderBlocksWithOptions = DistributeIntersection<
  PageBuilderBlocks[number],
  BlockOptions
>;

type PageBuilderBlockUnion = PageBuilderBlocksWithOptions;

// Union of all the types
export type PageBuilderBlockTypesUnion = PageBuilderBlockUnion["_type"];

// Extracts the props for a given block type
export type PageBuilderBlockProps<BlockType extends PageBuilderBlockTypesUnion> = Extract<
  PageBuilderBlockUnion,
  { _type: BlockType }
>;

type PageBuilderTypeMap = {
  [T in PageBuilderBlocksWithOptions as T["_type"]]: T;
};

// Define the renderer map using the inferred BlockTypeMap
export type PageBuilderTypeRenderMap = {
  [K in keyof PageBuilderTypeMap]: (props: PageBuilderTypeMap[K]) => React.ReactNode;
};
