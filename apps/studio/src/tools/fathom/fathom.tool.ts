import { LineChart } from "lucide-react";

import { FathomDashboard } from "@/tools/fathom/fathom-dashboard.component";

export const fathomTool = () => {
  return {
    title: "Analytics",
    name: "fathom",
    icon: LineChart,
    component: FathomDashboard,
  };
};
