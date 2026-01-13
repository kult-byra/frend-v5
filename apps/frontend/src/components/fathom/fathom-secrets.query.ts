import { groq } from "next-sanity";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { fathomSecretsNamespace } from "./fathom-secrets-namespace.util";

export const fetchFathomSecrets = async () => {
  const fathomSecretsQuery = groq`*[_id == $id][0].secrets`;

  const data = await sanityFetch({
    query: fathomSecretsQuery,
    params: {
      id: `secrets.${fathomSecretsNamespace}`,
    },
    tags: ["fathom-secrets"],
  });

  return data.data;
};
