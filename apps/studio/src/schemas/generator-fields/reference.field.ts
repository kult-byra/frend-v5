import type { ArrayDefinition, ReferenceDefinition, ReferenceOptions } from "sanity";
import { defineArrayMember, defineField } from "sanity";

// --- Type Definitions ---

/**
 * Base options shared by both single and multiple reference fields
 */
type ReferenceBaseOptions = {
  /** Document types that can be referenced */
  to: ReferenceDefinition["to"];

  /** GROQ filter to constrain selectable documents */
  filter?: string;

  /** Parameters for the filter query */
  filterParams?: Record<string, unknown>;

  /** Disable "Create new" button in reference picker */
  disableNew?: boolean;

  /** Create a weak reference (allows referenced doc to be deleted) */
  weak?: boolean;

  /** Mark as required */
  required?: boolean;

  /** Field group(s) */
  group?: string | string[];

  /** Fieldset */
  fieldset?: string;
};

/**
 * Props for a single reference field
 */
type SingleReferenceProps = ReferenceBaseOptions & {
  name: string;
  title?: string;
  description?: string;
  hidden?: ReferenceDefinition["hidden"];
  readOnly?: ReferenceDefinition["readOnly"];
  validation?: ReferenceDefinition["validation"];

  /** Must be false or undefined for single reference */
  allowMultiple?: false;
};

/**
 * Props for multiple references (array of references)
 */
type MultipleReferenceProps = ReferenceBaseOptions & {
  name: string;
  title?: string;
  description?: string;
  hidden?: ArrayDefinition["hidden"];
  readOnly?: ArrayDefinition["readOnly"];
  validation?: ArrayDefinition["validation"];

  /** Must be true for multiple references */
  allowMultiple: true;

  /** Minimum number of references required */
  min?: number;

  /** Maximum number of references allowed */
  max?: number;

  /** Custom title for individual items in picker */
  itemTitle?: string;
};

export type ReferenceFieldProps = SingleReferenceProps | MultipleReferenceProps;

// --- Helper to check if multiple ---
const isMultiple = (props: ReferenceFieldProps): props is MultipleReferenceProps => {
  return props.allowMultiple === true;
};

// --- Helper to build reference options ---
const buildReferenceOptions = (
  disableNew?: boolean,
  filter?: string,
  filterParams?: Record<string, unknown>,
): ReferenceOptions | undefined => {
  if (filter) {
    return {
      disableNew: disableNew ?? false,
      filter,
      filterParams,
    };
  }
  return {
    disableNew: disableNew ?? false,
  };
};

// --- Main Export ---

/**
 * Creates a reference field with convenient defaults and options.
 *
 * @example Single reference
 * ```ts
 * referenceField({
 *   name: "author",
 *   title: "Author",
 *   to: [{ type: "author" }],
 *   required: true,
 * })
 * ```
 *
 * @example Multiple references with constraints
 * ```ts
 * referenceField({
 *   name: "categories",
 *   title: "Categories",
 *   to: [{ type: "category" }],
 *   allowMultiple: true,
 *   min: 1,
 *   max: 5,
 * })
 * ```
 *
 * @example Filtered references
 * ```ts
 * referenceField({
 *   name: "featuredArticle",
 *   title: "Featured Article",
 *   to: [{ type: "article" }],
 *   filter: "isFeatured == true",
 * })
 * ```
 */
export const referenceField = (props: ReferenceFieldProps) => {
  if (isMultiple(props)) {
    return multipleReferenceField(props);
  }
  return singleReferenceField(props);
};

// --- Single Reference ---
const singleReferenceField = (props: SingleReferenceProps) => {
  const {
    name,
    title,
    description,
    to,
    filter,
    filterParams,
    disableNew,
    weak,
    required,
    group,
    fieldset,
    hidden,
    readOnly,
    validation,
  } = props;

  return defineField({
    name,
    title,
    description,
    type: "reference",
    to,
    weak,
    group,
    fieldset,
    hidden,
    readOnly,
    options: buildReferenceOptions(disableNew, filter, filterParams),
    validation:
      validation ??
      ((Rule) => {
        const rules = [];
        if (required) rules.push(Rule.required().error("This field is required"));
        return rules;
      }),
  });
};

// --- Multiple References (Array) ---
const multipleReferenceField = (props: MultipleReferenceProps) => {
  const {
    name,
    title,
    description,
    to,
    filter,
    filterParams,
    disableNew,
    weak,
    required,
    group,
    fieldset,
    hidden,
    readOnly,
    validation,
    min,
    max,
    itemTitle,
  } = props;

  return defineField({
    name,
    title,
    description,
    type: "array",
    group,
    fieldset,
    hidden,
    readOnly,
    of: [
      defineArrayMember({
        type: "reference",
        title: itemTitle ?? "Select document",
        to,
        weak,
        options: buildReferenceOptions(disableNew, filter, filterParams),
      }),
    ],
    validation:
      validation ??
      ((Rule) => {
        const rules = [Rule.unique().error("Duplicates are not allowed")];
        if (required) rules.push(Rule.required().error("At least one item is required"));
        if (min) rules.push(Rule.min(min).error(`Minimum ${min} item(s) required`));
        if (max) rules.push(Rule.max(max).error(`Maximum ${max} item(s) allowed`));
        return rules;
      }),
  });
};
