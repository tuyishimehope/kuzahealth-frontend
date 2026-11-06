import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MousePointer2,
  Plus,
  Search,
  Stethoscope,
  Syringe,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Sample data for the product preview (clearly labelled as sample).   */
/* ------------------------------------------------------------------ */
type Tone = "warning" | "info" | "success" | "neutral";
const DUE = [
  { initials: "UA", name: "Uwase Aline", meta: "32 weeks · Village A", tag: "ANC 3 overdue", tone: "warning" as Tone, active: true },
  { initials: "MG", name: "Mukamana Grace", meta: "Baby, 10 weeks", tag: "Penta 2 · Thu", tone: "info" as Tone },
  { initials: "ID", name: "Ingabire Diane", meta: "24 weeks · Village C", tag: "ANC 2 · Fri", tone: "neutral" as Tone },
  { initials: "NC", name: "Niyonsaba Claudine", meta: "Delivered · 3 days ago", tag: "Postnatal check", tone: "success" as Tone },
];

const TAG_TONE: Record<Tone, string> = {
  warning: "bg-warning-50 text-warning-700 ring-warning-200",
  info: "bg-info-50 text-info-700 ring-info-200",
  success: "bg-success-50 text-success-700 ring-success-200",
  neutral: "bg-muted text-muted-foreground ring-border",
};

function Cursor({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute hidden lg:flex flex-col items-start gap-1", className)}>
      <MousePointer2 className="h-4 w-4 fill-white/20 text-white" />
      <span className="ml-3 rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur">
        {label}
      </span>
    </div>
  );
}

function ProductPreview() {
  const steps = [
    { label: "1", state: "done" },
    { label: "2", state: "done" },
    { label: "3", state: "overdue" },
    { label: "4", state: "upcoming" },
  ];
  return (
    <div className="card-surface overflow-hidden shadow-float">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-semibold text-foreground">Due this week</span>
          <span className="text-muted-foreground">· Sample health centre</span>
        </div>
        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-700">
          Sample data
        </span>
      </div>

      <div className="grid md:grid-cols-[1.1fr_1fr]">
        <ul className="divide-y divide-border/70 p-2">
          {DUE.map((m) => (
            <li
              key={m.name}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5",
                m.active && "bg-primary-50/70"
              )}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-100 text-[11px] font-semibold text-primary-700">
                {m.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-foreground">{m.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{m.meta}</p>
              </div>
              <span className={cn("shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset", TAG_TONE[m.tone])}>
                {m.tag}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-border p-5 md:border-l md:border-t-0">
          <p className="eyebrow text-muted-foreground">Mother</p>
          <p className="mt-1 font-display text-xl font-semibold text-foreground">Uwase Aline</p>
          <p className="text-[12px] text-muted-foreground">28 years · first pregnancy · due 14 Jan</p>

          <p className="mt-5 text-[12px] font-medium text-foreground">Antenatal visits</p>
          <div className="mt-3 flex items-center">
            {steps.map((s, i) => (
              <div key={s.label} className="flex flex-1 items-center last:flex-none">
                <span
                  className={cn(
                    "grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold",
                    s.state === "done" && "bg-primary text-white",
                    s.state === "overdue" && "bg-warning-50 text-warning-700 ring-2 ring-warning-400",
                    s.state === "upcoming" && "bg-muted text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <span className={cn("mx-1 h-0.5 flex-1 rounded", i < 1 ? "bg-primary" : "bg-border")} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-muted/70 p-3">
              <p className="text-[10px] text-muted-foreground">Last visit</p>
              <p className="text-[12px] font-semibold text-foreground">12 Oct · BP normal</p>
            </div>
            <div className="rounded-xl bg-warning-50 p-3">
              <p className="text-[10px] text-warning-700/80">Next visit</p>
              <p className="text-[12px] font-semibold text-warning-700">Overdue by 5 days</p>
            </div>
          </div>

          <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground shadow-sm hover:bg-primary-700">
            Record a visit
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const chips = [
    { icon: UserPlus, label: t("landing.hero.chip1", "New mother") },
    { icon: Stethoscope, label: t("landing.hero.chip2", "ANC visit") },
    { icon: Syringe, label: t("landing.hero.chip3", "Vaccination") },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-hero pb-20 pt-32 sm:pt-36">
      <div className="bg-stars absolute inset-0 -z-10 opacity-80" />
      {/* light beams */}
      <div className="absolute left-1/2 top-0 -z-10 h-80 w-[60rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(var(--primary-400)/0.35),transparent)] blur-2xl" />

      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.a
          href="#how"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1 pl-1 pr-3 text-[12px] text-white/90 backdrop-blur hover:bg-white/15"
        >
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-primary-700">
            {t("landing.hero.badge", "New")}
          </span>
          {t("landing.hero.badgeText", "A digital register for mother & child care")}
          <ArrowRight className="h-3 w-3" />
        </motion.a>

        <div className="relative mx-auto mt-6 max-w-3xl">
          <Cursor label="Nurse · Health centre" className="-left-16 top-10" />
          <Cursor label="Community health worker" className="-right-20 top-28" />
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-[2.6rem] font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl"
          >
            {t("landing.hero.title1", "Maternal & child care,")}
            <br />
            <span className="italic text-white/95">
              {t("landing.hero.title2", "without the paper book")}
            </span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-base"
        >
          {t(
            "landing.hero.subtitle",
            "KuzaHealth helps health workers record pregnancies, visits and vaccinations, and see which mothers and babies are due for care."
          )}
        </motion.p>

        {/* Search / command bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass mx-auto mt-10 max-w-2xl rounded-2xl p-3 text-left shadow-float"
        >
          <button
            onClick={() => navigate("/auth/signin")}
            className="flex w-full items-center gap-2 px-2 py-2 text-[14px] text-muted-foreground"
          >
            <Search className="h-4 w-4" />
            {t("landing.hero.search", "Search a mother by name, ID or phone number…")}
          </button>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-border bg-white text-muted-foreground">
              <Plus className="h-3.5 w-3.5" />
            </span>
            {chips.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-[12px] font-medium text-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
              </span>
            ))}
            <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-medium text-warning-700">
              <span className="h-1.5 w-1.5 rounded-full bg-warning-500" />
              {t("landing.hero.due", "3 due this week")}
            </span>
            <button
              onClick={() => navigate("/auth/signin")}
              aria-label="Open register"
              className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white shadow-sm hover:bg-primary-700"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mx-auto mt-14 max-w-4xl text-left"
        >
          <ProductPreview />
        </motion.div>
      </div>
    </section>
  );
}
