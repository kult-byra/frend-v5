import { cn } from "./cn.util";

export const hyphenate = (string: string, minLength: number, hyphensNone?: string) => {
  if (!string) return "";

  const words = string.split(" ");

  const longWords = words.filter(
    (word) => word.length >= minLength && !word.includes("-") && !word.includes("–"),
  );

  const hyphenated = words.map((word, i) => {
    if (longWords?.includes(word)) {
      return (
        <span
          key={`${word}_${
            // biome-ignore lint/suspicious/noArrayIndexKey: Using word as well
            i
          }`}
          className={cn("hyphens-auto", hyphensNone ?? "sm:hyphens-none")}
        >
          {word}{" "}
        </span>
      );
    }
    return `${word} `;
  });

  return hyphenated;
};
