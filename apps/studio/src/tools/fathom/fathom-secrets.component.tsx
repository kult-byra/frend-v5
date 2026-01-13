"use client";

import { SettingsView, useSecrets } from "@sanity/studio-secrets";
import {
  type FathomSecretsProps,
  fathomSecretsNamespace,
} from "@/tools/fathom/fathom-secrets-namespace.util";

const pluginConfigKeys = [
  {
    key: "fathomSiteId",
    title: "Site ID",
  },
  {
    key: "fathomShareSlug",
    title: "Share slug",
    description: 'In Fathom, the last piece of the "Share URL" path under settings',
  },
  {
    key: "fathomSharePassword",
    title: "Password (if any)",
  },
  {
    key: "fathomSites",
    title: "Included domains",
    description: "Comma-separated list of domains to include",
  },
];

export const FathomSecrets = (props: { onClose: () => void }) => {
  const { onClose } = props;

  return (
    <SettingsView
      title="Fathom analytics settings"
      namespace={fathomSecretsNamespace}
      keys={pluginConfigKeys}
      onClose={onClose}
    />
  );
};

export const useFathomSecrets = () => {
  const { secrets } = useSecrets<FathomSecretsProps>(fathomSecretsNamespace);

  return secrets;
};
