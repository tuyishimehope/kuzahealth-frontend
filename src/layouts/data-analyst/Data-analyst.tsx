import { BarChart3, CalendarDays, LayoutDashboard, Settings, Users2, UsersRound } from "lucide-react";
import AppShell, { type NavSection } from "@/components/shell/AppShell";

const sections: NavSection[] = [
  {
    items: [{ label: "Dashboard", href: "/data-analyst/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Records",
    items: [
      { label: "Health workers", href: "/data-analyst/health-workers", icon: UsersRound },
      { label: "Mothers", href: "/data-analyst/parents", icon: Users2 },
      { label: "Schedules", href: "/data-analyst/schedules", icon: CalendarDays },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Reports", href: "/data-analyst/reports", icon: BarChart3 },
      { label: "Settings", href: "/data-analyst/settings", icon: Settings },
    ],
  },
];

const DatanalystLayout = () => <AppShell portal="Data analyst" sections={sections} />;

export default DatanalystLayout;
