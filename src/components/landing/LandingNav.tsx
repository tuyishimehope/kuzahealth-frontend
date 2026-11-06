import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import Logo from "@/components/common/Logo";
import { ModernDropdownSelector } from "@/components/layout/useLanguageSelector";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#how", key: "landing.nav.how", fallback: "How it works" },
  { href: "#features", key: "landing.nav.features", fallback: "Features" },
  { href: "#roles", key: "landing.nav.roles", fallback: "Who it's for" },
  { href: "#about", key: "landing.nav.about", fallback: "About" },
];

export default function LandingNav() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-border/70 bg-white/85 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo tone={solid ? "dark" : "light"} />

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={cn(
                  "text-[13px] font-medium transition-colors",
                  solid
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/75 hover:text-white"
                )}
              >
                {t(l.key, l.fallback)}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <ModernDropdownSelector
            lang={i18n.language}
            changeLanguage={(lng: string) => i18n.changeLanguage(lng)}
            tone={solid ? "light" : "dark"}
          />
          <button
            onClick={() => navigate("/auth/signin")}
            className={cn(
              "rounded-full px-4 py-2 text-[13px] font-medium transition",
              solid
                ? "text-foreground hover:bg-muted"
                : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
            )}
          >
            {t("landing.nav.signin", "Sign in")}
          </button>
          <button
            onClick={() => navigate("/auth/signup")}
            className={cn(
              "rounded-full px-4 py-2 text-[13px] font-semibold shadow-sm transition",
              solid
                ? "bg-primary text-primary-foreground hover:bg-primary-700"
                : "bg-white text-brand-navy hover:bg-primary-50"
            )}
          >
            {t("landing.nav.cta", "Get started")}
          </button>
        </div>

        <button
          className={cn("md:hidden", solid ? "text-foreground" : "text-white")}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-white px-4 pb-6 pt-2 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-base font-medium text-foreground"
            >
              {t(l.key, l.fallback)}
            </a>
          ))}
          <div className="mt-4 grid gap-2">
            <button
              onClick={() => navigate("/auth/signin")}
              className="rounded-full border border-border py-3 text-sm font-medium"
            >
              {t("landing.nav.signin", "Sign in")}
            </button>
            <button
              onClick={() => navigate("/auth/signup")}
              className="rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              {t("landing.nav.cta", "Get started")}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
