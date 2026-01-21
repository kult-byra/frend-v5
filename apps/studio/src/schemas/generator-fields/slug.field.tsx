import { ROOT_PATHS } from "@workspace/routing/src/route.config";
import type { SlugDefinition, SlugIsUniqueValidator, SlugOptions } from "sanity";
import { defineField } from "sanity";
import { SlugInput } from "@/components/inputs/slug-input.component";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";
import { acceptedSlugCharacters } from "@/utils/accepted-slug-characters.util";
import { STUDIO_BASE_PATH } from "@/utils/studio-base-path.util";

export const slugField = (
  props?: Omit<FieldDef<SlugDefinition>, "name" | "group"> & {
    name?: string;
    source?: SlugOptions["source"];
    isUnique?: SlugIsUniqueValidator;
    group?: string | false;
    isStatic?: boolean;
  },
) => {
  const { group, isUnique, source, isStatic, name } = props ?? {};

  return defineField({
    ...props,
    name: name ?? "slug",
    type: "slug",
    group: group === false ? undefined : (group ?? "key"),
    validation: (Rule) => {
      const rules = [
        Rule.custom((slug, context) => {
          if (!slug?.current || typeof slug?.current === "undefined") {
            return true;
          }
          if (slug.current.split("").some((c) => !acceptedSlugCharacters.includes(c))) {
            return "Slugen inneholder ugldige tegn. Gyldige tegn er a–z, 0–9 og bindestrek (-).";
          }
          if (
            context?.document?._type === "page" &&
            [STUDIO_BASE_PATH, ...ROOT_PATHS].includes(slug.current)
          ) {
            return "Denne slugen er reservert og kan ikke brukes";
          }
          return true;
        }).error(),
      ];

      if (!isStatic) {
        rules.push(Rule.required().error());
      }

      return rules;
    },
    options: {
      isUnique: isUnique,
      required: true,
      source: source ?? "title",
      maxLength: 96,
    },
    components: {
      input: (props) => <SlugInput {...props} isStatic={isStatic} />,
    },
  });
};
