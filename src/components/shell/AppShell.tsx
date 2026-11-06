import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { Bell, ChevronsLeft, ChevronsRight, LogOut, Menu, X } from "lucide-react";
import { LogoMark } from "@/components/common/Logo";
import { ModernDropdownSelector } from "@/components/layout/useLanguageSelector";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

interface AppShellProps {
  /** Portal name shown under the logo, e.g. "Health worker" */
  portal: string;
  sections: NavSection[];
  /** Optional extra content (e.g. guards) rendered before the outlet */
  children?: ReactNode;
}

interface DecodedToken {
  email?: string;
  name?: string;
}

function useCurrentUser() {
  return useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return { name: "", email: "" };
    try {
      const d = jwtDecode<DecodedToken>(token);
      const email = d.email ?? "";
      const fromEmail = email.split("@")[0] ?? "";
      const name = d.name || fromEmail.charAt(0).toUpperCase() + fromEmail.slice(1);
      return { name, email };
    } catch {
      return { name: "", email: "" };
    }
  }, []);
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "U";

/* ------------------------------------------------------------------ */

function SidebarBody({
  portal,
  sections,
  collapsed,
  onNavigate,
  onLogout,
}: {
  portal: string;
  sections: NavSection[];
  collapsed: boolean;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="bg-navy-panel relative flex h-full flex-col overflow-hidden text-white">
      <div className="bg-stars pointer-events-none absolute inset-0 opacity-50" />

      {/* Brand */}
      <div className={cn("relative flex h-16 items-center gap-2.5 px-5", collapsed && "justify-center px-0")}>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 ring-1 ring-inset ring-white/15">
          <LogoMark className="h-5 w-5 text-white" />
        </span>
        {!collapsed && (
          <div className="leading-tight">
            <p className="font-display text-[15px] font-semibold">KuzaHealth</p>
            <p className="text-[11px] text-white/55">{portal}</p>
          </div>
        )}
      </div>

      {/* Links */}
      <nav className="relative flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {sections.map((section, i) => (
          <div key={section.title ?? i}>
            {section.title && !collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                {section.title}
              </p>
            )}
            {section.title && collapsed && i > 0 && <div className="mx-3 mb-2 h-px bg-white/10" />}
            <ul className="space-y-0.5">
              {section.items.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <NavLink
                    to={href}
                    end
                    onClick={onNavigate}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                        collapsed && "justify-center px-0",
                        isActive
                          ? "bg-white/[0.12] text-white"
                          : "text-white/65 hover:bg-white/[0.06] hover:text-white"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary-300" />
                        )}
                        <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-primary-200" : "text-white/55 group-hover:text-white/80")} />
                        {!collapsed && <span className="truncate">{label}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="relative border-t border-white/10 p-3">
        <button
          onClick={onLogout}
          title={collapsed ? t("sidebar.logout", "Sign out") : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-white/70 transition hover:bg-danger-500/15 hover:text-white",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-[18px] w-[18px]" />
          {!collapsed && t("sidebar.logout", "Sign out")}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function AppShell({ portal, sections, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const user = useCurrentUser();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const pageTitle = useMemo(() => {
    const items = sections.flatMap((s) => s.items);
    const exact = items.find((i) => i.href === location.pathname);
    const prefix = items
      .filter((i) => location.pathname.startsWith(i.href))
      .sort((a, b) => b.href.length - a.href.length)[0];
    return (exact ?? prefix)?.label ?? portal;
  }, [sections, location.pathname, portal]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth/signin");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 76 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative hidden shrink-0 md:block"
      >
        <SidebarBody portal={portal} sections={sections} collapsed={collapsed} onLogout={logout} />
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-20 z-10 grid h-6 w-6 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-soft hover:text-foreground"
        >
          {collapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
        </button>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-brand-midnight/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] md:hidden"
            >
              <SidebarBody
                portal={portal}
                sections={sections}
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
                onLogout={logout}
              />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-4 rounded-lg p-1.5 text-white/70 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl md:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="hidden text-[11px] font-medium text-muted-foreground sm:block">{portal}</p>
            <h1 className="truncate font-display text-lg font-semibold leading-tight text-foreground">{pageTitle}</h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block">
              <ModernDropdownSelector
                lang={i18n.language}
                changeLanguage={(lng: string) => i18n.changeLanguage(lng)}
              />
            </div>
            <button
              aria-label="Notifications"
              className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1 pl-1 pr-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                {initialsOf(user.name)}
              </span>
              <div className="hidden leading-tight sm:block">
                <p className="text-[12px] font-semibold text-foreground">{user.name || "Account"}</p>
                {user.email && <p className="text-[10px] text-muted-foreground">{user.email}</p>}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8 md:py-8">
            {children}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
