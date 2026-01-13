import { LayoutDashboard } from "lucide-react";
import styled from "styled-components";
import { env } from "@/env";

const StyledIframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
`;

export const kultDashboardTool = () => {
  if (!env.SANITY_STUDIO_KULT_DASHBOARD_URL) return null;

  return {
    title: "Kult dashboard",
    name: "kult-dashboard",
    icon: LayoutDashboard,
    component: () => (
      <StyledIframe
        id="kult-dashboard-iframe"
        src={env.SANITY_STUDIO_KULT_DASHBOARD_URL}
        title="Kult dashboard"
      />
    ),
  };
};
