import { type SidebarNavItem } from "@/types";

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[];
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Account",
      href: "/dashboard/account",
      icon: "userRound",
      items: [],
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
      items: [],
    },
    {
      title: "Purchases",
      href: "/dashboard/purchases",
      icon: "dollarSign",
      items: [],
    },
  ],
};
