import nodeCrypto from "node:crypto";

export const getRandomUuid = () => {
  if (typeof crypto !== "undefined") {
    return crypto.randomUUID();
  }

  return nodeCrypto.randomUUID();
};
