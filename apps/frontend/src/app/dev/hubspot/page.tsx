import { HubspotForm } from "@/components/hubspot/hubspot-form.component";
import { Container } from "@/components/layout/container.component";

const HUBSPOT_FORM_ID = "8b198a03-59c9-4487-bdaf-9becc6b011b4";

export default function HubspotDevPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container fullWidth>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">HubSpot Form Integration</h1>
          <p className="mt-2 text-gray-600">Development page for testing HubSpot form rendering.</p>
          <p className="mt-1 text-sm text-gray-500">
            Form ID: <code className="bg-gray-100 px-1 py-0.5 rounded">{HUBSPOT_FORM_ID}</code>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <HubspotForm formId={HUBSPOT_FORM_ID} />
        </div>
      </Container>
    </div>
  );
}
