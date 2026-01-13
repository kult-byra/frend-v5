import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/server/sanity/sanity-regular-client";
import { token } from "@/server/sanity/sanity-token";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
});
