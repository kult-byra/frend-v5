import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "headline-1",
            "headline-2",
            "headline-3",
            "body",
            "body-title",
            "body-large",
            "body-small",
            "code",
          ],
        },
      ],
    },
  },
});

export const cn = (...classNames: ClassValue[]) => twMerge(clsx(classNames));
