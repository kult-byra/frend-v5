"use client";

import { Autocomplete, Badge, Button, Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type StringInputProps, set, unset } from "sanity";
import { env } from "@/env";
import { HubspotSecrets, useHubspotSecrets } from "@/tools/hubspot/hubspot-secrets.component";

type HubspotFormField = {
  name: string;
  label: string;
  fieldType: string;
  required: boolean;
  hidden?: boolean;
};

type HubspotForm = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
  fieldGroups?: Array<{
    groupType: string;
    richTextType: string;
    fields: HubspotFormField[];
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
        throw new Error(data.error || `Error fetching forms (${response.status})`);
      }

      setForms(data.results || []);
      setPortalId(data.portalId || secrets.hubspotPortalId || null);

      // If we have a value, find the corresponding form for preview
      if (value && data.results) {
        const form = data.results.find((f) => f.id === value);
        setSelectedForm(form || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
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
            {fieldCount} {fieldCount === 1 ? "field" : "fields"} • ID: {form.id}
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
                HubSpot is not configured
              </Text>
              <Text size={1} muted>
                You must configure the HubSpot API secret before selecting a form.
              </Text>
            </Stack>
          </Flex>
        </Card>
        <Button text="Configure HubSpot" tone="primary" onClick={() => setShowSettings(true)} />
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
            Fetching forms from HubSpot...
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
                Error fetching forms
              </Text>
              <Text size={1} muted>
                {error}
              </Text>
            </Stack>
          </Flex>
        </Card>
        <Flex gap={2}>
          <Button text="Try again" icon={RefreshCw} tone="primary" onClick={fetchForms} />
          <Button text="Change settings" mode="ghost" onClick={() => setShowSettings(true)} />
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
            placeholder="Search for form..."
            icon={Search}
            openButton
            loading={loading}
          />
        </div>
        <Button
          icon={RefreshCw}
          mode="ghost"
          title="Refresh list"
          onClick={fetchForms}
          disabled={loading}
        />
      </Flex>

      {/* Form preview */}
      {selectedForm && (
        <FormPreview form={selectedForm} portalId={portalId} onClear={handleClear} />
      )}

      {showSettings && <HubspotSecrets onClose={() => setShowSettings(false)} />}
    </Stack>
  );
};

type FormPreviewProps = {
  form: HubspotForm;
  portalId: string | null;
  onClear: () => void;
};

function FormPreview({ form, portalId, onClear }: FormPreviewProps) {
  const allFields = form.fieldGroups?.flatMap((group) => group.fields || []) || [];
  const visibleFields = allFields.filter((f) => !f.hidden);
  const hiddenFields = allFields.filter((f) => f.hidden);

  return (
    <Card padding={4} radius={2} tone="positive" border>
      <Stack space={4}>
        {/* Header */}
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={2}>
            <CheckCircle2 size={16} />
            <Text size={1} weight="semibold">
              {form.name}
            </Text>
            {form.archived && (
              <Badge tone="caution" fontSize={0}>
                Archived
              </Badge>
            )}
          </Flex>
          <Button
            text="Remove"
            mode="ghost"
            tone="critical"
            fontSize={1}
            padding={2}
            onClick={onClear}
          />
        </Flex>

        {/* Visible fields */}
        {visibleFields.length > 0 && (
          <Stack space={2}>
            <Flex align="center" gap={2}>
              <Eye size={14} style={{ opacity: 0.6 }} />
              <Text size={1} muted>
                Visible fields ({visibleFields.length})
              </Text>
            </Flex>
            <Card padding={3} radius={2} tone="transparent">
              <Stack space={2}>
                {visibleFields.map((field) => (
                  <FieldRow key={field.name} field={field} />
                ))}
              </Stack>
            </Card>
          </Stack>
        )}

        {/* Hidden fields */}
        {hiddenFields.length > 0 && (
          <Stack space={2}>
            <Flex align="center" gap={2}>
              <EyeOff size={14} style={{ opacity: 0.6 }} />
              <Text size={1} muted>
                Hidden fields ({hiddenFields.length})
              </Text>
            </Flex>
            <Card padding={3} radius={2} tone="transparent" style={{ opacity: 0.7 }}>
              <Stack space={2}>
                {hiddenFields.map((field) => (
                  <FieldRow key={field.name} field={field} />
                ))}
              </Stack>
            </Card>
          </Stack>
        )}

        {/* Footer with ID and link */}
        <Flex
          gap={3}
          align="center"
          style={{ borderTop: "1px solid var(--card-border-color)", paddingTop: 12 }}
        >
          <Text size={0} muted>
            ID: {form.id}
          </Text>
          {portalId && (
            <a
              href={`https://app.hubspot.com/forms/${portalId}/editor/${form.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <Text size={0} style={{ color: "#0070f3" }}>
                Open in HubSpot
              </Text>
              <ExternalLink size={12} style={{ color: "#0070f3" }} />
            </a>
          )}
        </Flex>
      </Stack>
    </Card>
  );
}

function FieldRow({ field }: { field: HubspotFormField }) {
  return (
    <Flex align="center" gap={2}>
      <Text size={1}>
        • {field.label || field.name}
        {field.required && <span style={{ color: "#f03e3e", marginLeft: 2 }}>*</span>}
      </Text>
      <Text size={0} muted>
        ({field.fieldType})
      </Text>
    </Flex>
  );
}
