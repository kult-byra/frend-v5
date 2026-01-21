import type { MenuSettingsQueryResult } from "@/sanity-types";

export type MainMenuProps = NonNullable<MenuSettingsQueryResult>["mainMenu"];

export type SecondaryMenuProps = NonNullable<MenuSettingsQueryResult>["secondaryMenu"];

export type MenuItemProps = NonNullable<MainMenuProps>[number];

export type LinkGroupProps = Extract<MenuItemProps, { linkType: "linkGroup" }>;
