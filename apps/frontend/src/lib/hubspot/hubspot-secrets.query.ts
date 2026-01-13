import { groq } from "next-sanity";
import { type HubspotSecretsProps, hubspotSecretsNamespace } from "./hubspot-secrets-namespace.util";
import { authClient } from "@/server/sanity/sanity-auth-client";

export const fetchHubspotSecrets = async (): Promise<HubspotSecretsProps | null> => {
  const hubspotSecretsQuery = groq`*[_id == $id][0].secrets`;

  const data = await authClient.fetch(hubspotSecretsQuery, {
    id: `secrets.${hubspotSecretsNamespace}`,
  });

  return data as HubspotSecretsProps | null;
};

