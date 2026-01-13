import { Download, Globe, Link } from "lucide-react";
import type { BlockAnnotationProps } from "sanity";

export const LinkRenderer = (props: BlockAnnotationProps) => {
  const Icon = getIcon(props.value._type);

  return (
    <span>
      {props.renderDefault(props)}
      <Icon style={{ marginLeft: "0" }} size={18} />
    </span>
  );
};

const getIcon = (type: string) => {
  switch (type) {
    case "internalLinkObject":
      return Link;
    case "downloadLinkObject":
      return Download;
    default:
      return Globe;
  }
};
