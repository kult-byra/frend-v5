type FormatPageTag = {
  type: string;
  slug: string;
};

export const formatPageTag = ({ type, slug }: FormatPageTag) => {
  return `${type}:${slug}`;
};
