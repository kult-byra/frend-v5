import { resolvePath } from "@workspace/routing/src/resolve-path";
import { usePathname } from "next/navigation";
import type { MenuItemProps } from "@/components/layout/menu/menu.types";

export const useIsLinkTypeActive = (props: MenuItemProps) => {
  const params = usePathname();

  if (props.linkType === "internal") {
    const { _type, slug } = props;
    const path = resolvePath(_type, slug ? { slug } : {});

    return params === path;
  }

  return false;
};
