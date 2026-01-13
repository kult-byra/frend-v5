import { type ArrayOfObjectsInputProps, ArrayOfPrimitivesFunctions } from "sanity";

export const LinksFieldInput = (props: ArrayOfObjectsInputProps & { max?: number }) => {
  const hasReachedMax = props.max && props.max <= props.members.length;

  return props.renderDefault({
    ...props,
    arrayFunctions: hasReachedMax
      ? () => null
      : // biome-ignore lint/suspicious/noExplicitAny: No other way to type this
        (props: any) => <ArrayOfPrimitivesFunctions {...props} />,
  });
};
