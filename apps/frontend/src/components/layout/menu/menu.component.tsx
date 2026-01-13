import { CollapsedMenu } from "@/components/layout/menu/collapsed-menu.component";
import { ExpandedMenu } from "@/components/layout/menu/expanded-menu.component";
import type { MenuSettingsQueryResult } from "@/sanity-types";

export const Menu = (props: MenuSettingsQueryResult) => {
  if (!props) return null;

  const { mainMenu } = props;

  if (!mainMenu) return null;

  return (
    <nav aria-label="Hovedmeny" data-primary-nav="true">
      <ExpandedMenu mainMenu={mainMenu} />
      <CollapsedMenu mainMenu={mainMenu} />
    </nav>
  );
};
