import type { FieldProps } from "sanity";
import { FieldWithTip } from "@/components/fields/field-with-tip.component";

export const WrapperField = (props: FieldProps) => {
  const { title: originalTitle, schemaType, renderDefault } = props;

  const isRequired = schemaType?.options?.required;
  const title = isRequired ? `${originalTitle} *` : originalTitle;

  const newProps = {
    ...props,
    title,
  };

  const hasTip = schemaType?.options?.tip;

  if (hasTip) {
    return <FieldWithTip {...newProps} />;
  }

  return renderDefault(newProps);
};
