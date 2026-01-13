import { Key, LayoutList, Search } from "lucide-react";

export const defaultGroups = [
  {
    title: "Nøkkelinfo",
    name: "key",
    default: true,
    icon: Key,
  },
  {
    title: "Innhold",
    name: "content",
    icon: LayoutList,
  },
  {
    title: "SEO",
    name: "meta",
    icon: Search,
  },
];
