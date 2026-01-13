// Define a generic FieldDef type that captures additional properties via TOtherProps
// export type FieldDef<
//   T,
//   TName extends string,
//   TRequired extends boolean = boolean,
//   TOtherProps = object,
// > = Omit<T, "type"> & {
//   name: TName;
//   required?: TRequired;
//   group?: string;
// } & TOtherProps;

export type FieldDef<T> = Omit<T, "type"> & {
  required?: boolean;
  group?: string | string[];
  fieldset?: string;
};
