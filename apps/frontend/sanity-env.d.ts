import type { SchemaTip } from "@/sanity/components/fields/field-with-tip.component";

declare module "styled-components" {
  interface DefaultTheme extends Theme {}
}

interface FieldOptions {
  required?: boolean;
  tip?: SchemaTip;
}

declare module "sanity" {
  export interface DocumentOptions {
    linkable?: boolean;
    singleton?: boolean;
  }

  export interface UrlOptions extends FieldOptions {}
  export interface StringOptions extends FieldOptions {}
  export interface NumberOptions extends FieldOptions {}
  export interface SlugOptions extends FieldOptions {}
  export interface TextOptions extends FieldOptions {}
  export interface ArrayOptions extends FieldOptions {}
  export interface ImageOptions extends FieldOptions {}
  export interface ObjectOptions extends FieldOptions {}
  export interface DatetimeOptions extends FieldOptions {}
  export interface ReferenceBaseOptions extends FieldOptions {}
}
