import { FormInput } from "lucide-react";
import { HubspotDashboard } from "@/tools/hubspot/hubspot-dashboard.component";

export const hubspotTool = () => {
  return {
    title: "HubSpot",
    name: "hubspot",
    icon: FormInput,
    component: HubspotDashboard,
  };
};

