import { useEffect, useState } from "react";

import { useFathomSecrets } from "@/tools/fathom/fathom-secrets.component";

export const useFathomUrl = () => {
  const { fathomSiteId, fathomShareSlug, fathomSharePassword } = useFathomSecrets() ?? {};

  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fathomSiteId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const fathomShareUrl = `https://app.usefathom.com/share/${fathomSiteId.toLowerCase()}${
      fathomShareSlug ? `/${fathomShareSlug}` : ""
    }`;

    const hashPassword = async (password: string) => {
      const passwordHash = await sha256(password);

      setUrl(`${fathomShareUrl}?password=${passwordHash}`);
      setLoading(false);
    };

    if (fathomSharePassword) {
      hashPassword(fathomSharePassword);
      return;
    }

    setUrl(fathomShareUrl);
    setLoading(false);
    return;
  }, [fathomSiteId, fathomShareSlug, fathomSharePassword]);

  return {
    url,
    loading,
  };
};

const sha256 = async (string: string) => {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(string);

  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};
