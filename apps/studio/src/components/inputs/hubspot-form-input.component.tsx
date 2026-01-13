"use client";

import { Autocomplete, Button, Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { AlertCircle, CheckCircle2, ExternalLink, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type StringInputProps, set, unset } from "sanity";
import { env } from "@/env";
import { HubspotSecrets, useHubspotSecrets } from "@/tools/hubspot/hubspot-secrets.component";

type HubspotForm = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  fieldGroups?: Array<{
    groupType: string;
    richTextType: string;
    fields: Array<{
      name: string;
      label: string;
      fieldType: string;
      required: boolean;
    }>;
  }>;
};

type HubspotFormsApiResponse = {
  results: HubspotForm[];
  portalId: string;
  error?: string;
};

export const HubspotFormInput = (props: StringInputProps) => {
  const { value, onChange } = props;
  const secrets = useHubspotSecrets();

  const [forms, setForms] = useState<HubspotForm[]>([]);
  const [portalId, setPortalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedForm, setSelectedForm] = useState<HubspotForm | null>(null);

  const fetchForms = useCallback(async () => {
    if (!secrets?.hubspotApiSecret) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${env.SANITY_STUDIO_FRONTEND_URL}/api/hubspot/forms`;

      const response = await fetch(apiUrl, {
        headers: {
          "X-API-Secret": secrets.hubspotApiSecret,
          "Content-Type": "application/json",
        },
      });

      const data: HubspotFormsApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Feil ved henting av skjemaer (${response.status})`);
      }

      setForms(data.results || []);
      setPortalId(data.portalId || secrets.hubspotPortalId || null);

      // If we have a value, find the corresponding form for preview
      if (value && data.results) {
        const form = data.results.find((f) => f.id === value);
        setSelectedForm(form || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  }, [secrets?.hubspotApiSecret, secrets?.hubspotPortalId, value]);

  useEffect(() => {
    if (secrets?.hubspotApiSecret) {
      fetchForms();
    }
  }, [secrets?.hubspotApiSecret, fetchForms]);

  // Prepare options for autocomplete
  const autocompleteOptions = useMemo(() => {
    return forms.map((form) => ({
      value: form.id,
      payload: form,
    }));
  }, [forms]);

  const handleFormSelect = (formId: string) => {
    if (!formId) {
      onChange(unset());
      setSelectedForm(null);
      return;
    }

    onChange(set(formId));
    const form = forms.find((f) => f.id === formId);
    setSelectedForm(form || null);
  };

  const handleClear = () => {
    onChange(unset());
    setSelectedForm(null);
  };

  // Custom render for autocomplete options
  const renderOption = useCallback((option: { value: string; payload: HubspotForm }) => {
    const form = option.payload;
    const fieldCount =
      form.fieldGroups?.reduce((acc, group) => acc + (group.fields?.length || 0), 0) || 0;

    return (
      <Card as="button" padding={3} style={{ width: "100%" }}>
        <Stack space={2}>
          <Text size={1} weight="medium">
            {form.name}
          </Text>
          <Text size={0} muted>
            {fieldCount} {fieldCount === 1 ? "felt" : "felter"} • ID: {form.id}
          </Text>
        </Stack>
      </Card>
    );
  }, []);

  // Custom render for selected value - show form name instead of ID
  const renderValue = useCallback(
    (currentValue: string) => {
      const form = forms.find((f) => f.id === currentValue);
      return form?.name || currentValue;
    },
    [forms],
  );

  // Filter function for autocomplete search
  const filterOption = useCallback(
    (query: string, option: { value: string; payload: HubspotForm }) => {
      const searchLower = query.toLowerCase();
      const form = option.payload;
      return (
        form.name.toLowerCase().includes(searchLower) || form.id.toLowerCase().includes(searchLower)
      );
    },
    [],
  );

  // No secrets configured
  if (!secrets?.hubspotApiSecret) {
    return (
      <Stack space={3}>
        <Card padding={4} radius={2} tone="caution">
          <Flex align="center" gap={3}>
            <AlertCircle size={20} />
            <Stack space={2}>
              <Text size={1} weight="semibold">
                HubSpot er ikke konfigurert
              </Text>
              <Text size={1} muted>
                Du må legge inn HubSpot API-hemmelighet før du kan velge skjema.
              </Text>
            </Stack>
          </Flex>
        </Card>
        <Button text="Konfigurer HubSpot" tone="primary" onClick={() => setShowSettings(true)} />
        {showSettings && <HubspotSecrets onClose={() => setShowSettings(false)} />}
      </Stack>
    );
  }

  // Loading state
  if (loading && forms.length === 0) {
    return (
      <Card padding={4} radius={2} tone="transparent">
        <Flex align="center" gap={3}>
          <Spinner muted />
          <Text size={1} muted>
            Henter skjemaer fra HubSpot...
          </Text>
        </Flex>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Stack space={3}>
        <Card padding={4} radius={2} tone="critical">
          <Flex align="center" gap={3}>
            <AlertCircle size={20} />
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Feil ved henting av skjemaer
              </Text>
              <Text size={1} muted>
                {error}
              </Text>
            </Stack>
          </Flex>
        </Card>
        <Flex gap={2}>
          <Button text="Prøv igjen" icon={RefreshCw} tone="primary" onClick={fetchForms} />
          <Button text="Endre innstillinger" mode="ghost" onClick={() => setShowSettings(true)} />
        </Flex>
        {showSettings && <HubspotSecrets onClose={() => setShowSettings(false)} />}
      </Stack>
    );
  }

  return (
    <Stack space={4}>
      <Flex gap={2} align="center">
        <div style={{ flex: 1 }}>
          <Autocomplete
            id="hubspot-form-search"
            options={autocompleteOptions}
            value={value || ""}
            onChange={handleFormSelect}
            filterOption={filterOption}
            renderOption={renderOption}
            renderValue={renderValue}
            placeholder="Søk etter skjema..."
            icon={Search}
            openButton
            loading={loading}
          />
        </div>
        <Button
          icon={RefreshCw}
          mode="ghost"
          title="Oppdater listen"
          onClick={fetchForms}
          disabled={loading}
        />
      </Flex>

      {/* Form preview */}
      {selectedForm && (
        <Card padding={4} radius={2} tone="positive" border>
          <Stack space={3}>
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={2}>
                <CheckCircle2 size={16} />
                <Text size={1} weight="semibold">
                  {selectedForm.name}
                </Text>
              </Flex>
              <Button
                text="Fjern"
                mode="ghost"
                tone="critical"
                fontSize={1}
                padding={2}
                onClick={handleClear}
              />
            </Flex>

            {selectedForm.fieldGroups && selectedForm.fieldGroups.length > 0 && (
              <>
                <Text size={1} muted>
                  Felter i skjemaet:
                </Text>

                <Stack space={2}>
                  {selectedForm.fieldGroups.flatMap((group) =>
                    group.fields?.map((field) => (
                      <Flex key={field.name} align="center" gap={2}>
                        <Text size={1}>
                          • {field.label || field.name}
                          {field.required && (
                            <Text as="span" size={1} style={{ color: "red" }}>
                              {" "}
                              *
                            </Text>
                          )}
                        </Text>
                        <Text size={0} muted>
                          ({field.fieldType})
                        </Text>
                      </Flex>
                    )),
                  )}
                </Stack>
              </>
            )}

            <Flex gap={2} marginTop={2}>
              <Text size={0} muted>
                ID: {selectedForm.id}
              </Text>
              {portalId && (
                <a
                  href={`https://app.hubspot.com/forms/${portalId}/editor/${selectedForm.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <Text size={0} style={{ color: "#0070f3" }}>
                    Åpne i HubSpot
                  </Text>
                  <ExternalLink size={12} style={{ color: "#0070f3" }} />
                </a>
              )}
            </Flex>
          </Stack>
        </Card>
      )}

      {showSettings && <HubspotSecrets onClose={() => setShowSettings(false)} />}
    </Stack>
  );
};
