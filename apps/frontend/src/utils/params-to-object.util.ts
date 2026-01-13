import type { URLSearchParams } from "node:url";

export const paramsToObject = (entries: URLSearchParams) => {
  // biome-ignore lint/suspicious/noExplicitAny: can be any
  const result: { [key: string]: any } = {};
  for (const [key, value] of entries) {
    // each 'entry' is a [key, value] tuple
    result[key] = value;
  }
  return result;
};
