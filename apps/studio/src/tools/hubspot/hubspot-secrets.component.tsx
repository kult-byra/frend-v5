"use client";

import { SettingsView, useSecrets } from "@sanity/studio-secrets";
import {
  type HubspotSecretsProps,
  hubspotSecretsNamespace,
} from "@/tools/hubspot/hubspot-secrets-namespace.util";

const pluginConfigKeys = [
  {
    key: "hubspotApiSecret",
    title: "API Secret",
    description: "Delt hemmelighet for autentisering mot API-et. Generer en tilfeldig streng (f.eks. 64 tegn).",
  },
  {
    key: "hubspotPortalId",
    title: "Portal ID",
    description: "Din HubSpot-konto/portal-ID (finnes i kontoinnstillinger eller URL)",
  },
];

export const HubspotSecrets = (props: { onClose: () => void }) => {
  const { onClose } = props;

  return (
    <SettingsView
      title="HubSpot-innstillinger"
      namespace={hubspotSecretsNamespace}
      keys={pluginConfigKeys}
      onClose={onClose}
    />
  );
};

export const useHubspotSecrets = () => {
  const { secrets } = useSecrets<HubspotSecretsProps>(hubspotSecretsNamespace);

  return secrets;
};

