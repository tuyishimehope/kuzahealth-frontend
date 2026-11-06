import {
  Baby,
  LayoutDashboard,
  ScrollText,
  Settings,
  ShieldCheck,
  UserPlus,
  UserRoundCog,
  Users2,
  UsersRound,
} from "lucide-react";
import AppShell, { type NavSection } from "@/components/shell/AppShell";

const sections: NavSection[] = [
  {
    items: [{ label: "Dashboard", href: "/superadmin/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "People",
    items: [
      { label: "Add health worker", href: "/superadmin/add-health-workers", icon: UserPlus },
      { label: "Health workers", href: "/superadmin/health-workers", icon: UsersRound },
      { label: "Mothers", href: "/superadmin/parents", icon: Baby },
      { label: "Add data analyst", href: "/superadmin/add-data-analyst", icon: UserRoundCog },
      { label: "Users", href: "/superadmin/users", icon: Users2 },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Audit", href: "/superadmin/audit", icon: ShieldCheck },
      { label: "Admin logs", href: "/superadmin/adminlogs", icon: ScrollText },
      { label: "Settings", href: "/superadmin/settings", icon: Settings },
    ],
  },
];

const SuperAdminLayout = () => <AppShell portal="Super admin" sections={sections} />;

export default SuperAdminLayout;
