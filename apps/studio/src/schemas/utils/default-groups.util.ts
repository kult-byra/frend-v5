import { Key, LayoutList, Link, Search } from "lucide-react";

export const defaultGroups = [
  {
    title: "Key info",
    name: "key",
    default: true,
    icon: Key,
  },
  {
    title: "Content",
    name: "content",
    icon: LayoutList,
  },
  {
    title: "Connections",
    name: "connections",
    icon: Link,
  },
  {
    title: "SEO",
    name: "meta",
    icon: Search,
  },
];
