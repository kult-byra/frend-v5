import type { MenuSettingsQueryResult } from "@/sanity-types";

export type MainMenuProps = NonNullable<MenuSettingsQueryResult>["mainMenu"];

export type MenuItemProps = NonNullable<MainMenuProps>[number];
