export const translationsQuery = `
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    "slug": slug.current,
    language
  }
`;
