import { Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { useState } from "react";
import { HubspotSecrets, useHubspotSecrets } from "@/tools/hubspot/hubspot-secrets.component";

export const HubspotDashboard = () => {
  const secrets = useHubspotSecrets();
  const [showSettings, setShowSettings] = useState(false);

  const isConfigured = Boolean(secrets?.hubspotApiSecret && secrets?.hubspotPortalId);

  return (
    <>
      <Flex
        align="center"
        justify="center"
        height="fill"
        padding={4}
        style={{ opacity: showSettings ? 0.3 : 1 }}
      >
        <Card padding={5} radius={2} shadow={1} style={{ maxWidth: 500 }}>
          <Stack space={4}>
            <Text size={2} weight="semibold">
              HubSpot-integrasjon
            </Text>

            {isConfigured ? (
              <>
                <Text size={1} muted>
                  HubSpot er konfigurert. Du kan nå bruke HubSpot-skjemaer i innholdet ditt.
                </Text>
                <Flex gap={2}>
                  <Text size={1}>
                    Portal ID: <strong>{secrets?.hubspotPortalId}</strong>
                  </Text>
                </Flex>
              </>
            ) : (
              <Text size={1} muted>
                HubSpot er ikke konfigurert. Klikk på knappen under for å legge til dine API-nøkler.
              </Text>
            )}

            <Button
              text={isConfigured ? "Endre innstillinger" : "Konfigurer HubSpot"}
              tone="primary"
              onClick={() => setShowSettings(true)}
            />
          </Stack>
        </Card>
      </Flex>

      {showSettings && <HubspotSecrets onClose={() => setShowSettings(false)} />}
    </>
  );
};
