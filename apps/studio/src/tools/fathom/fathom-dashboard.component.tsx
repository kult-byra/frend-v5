import { Button, Flex, Spinner, Text } from "@sanity/ui";
import { useState } from "react";
import { FathomSecrets } from "@/tools/fathom/fathom-secrets.component";
import { useFathomUrl } from "@/tools/fathom/use-fathom-url.hook";

export const FathomDashboard = () => {
  const { loading, url } = useFathomUrl();

  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          border: 0,
          opacity: showSettings ? 0.3 : 1,
        }}
      >
        {!loading && (
          <Button
            style={{ position: "absolute", top: "10px", right: "10px" }}
            fontSize={1}
            padding={2}
            text="Settings"
            onClick={() => setShowSettings(true)}
          />
        )}

        {loading ? (
          <Flex align="center" direction="column" gap={3} height="fill" justify="center">
            <Spinner muted />
            <Text muted size={1}>
              Loading…
            </Text>
          </Flex>
        ) : !url ? (
          <Flex align="center" height="fill" justify="center">
            <Text muted size={1}>
              Fathom not initialized correctly. Check settings.
            </Text>
          </Flex>
        ) : (
          <iframe
            style={{ width: "100%", height: "100%", border: 0 }}
            title="Fathom analytics"
            src={url}
          />
        )}
      </div>

      {showSettings && <FathomSecrets onClose={() => setShowSettings(false)} />}
    </>
  );
};
