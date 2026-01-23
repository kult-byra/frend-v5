import { groq } from "next-sanity";
import { fathomSecretsNamespace } from "@/components/fathom/fathom-secrets-namespace.util";
import { sanityFetch } from "@/server/sanity/sanity-live";

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
