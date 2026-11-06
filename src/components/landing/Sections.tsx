import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  CalendarClock,
  FileSpreadsheet,
  HeartHandshake,
  ListChecks,
  NotebookPen,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}

/* ------------------------------ Roles ------------------------------ */
export function RolesStrip() {
  const { t } = useTranslation();
  const roles = [
    { icon: UserRound, label: t("landing.roles.chw", "Community health workers") },
    { icon: Building2, label: t("landing.roles.nurses", "Health centre nurses") },
    { icon: HeartHandshake, label: t("landing.roles.midwives", "Midwives") },
    { icon: BarChart3, label: t("landing.roles.supervisors", "District supervisors") },
  ];
  return (
    <section id="roles" className="scroll-mt-20 py-14">
      <Container>
        <p className="text-center text-[12px] text-muted-foreground">
          {t("landing.roles.title", "Built for the people who care for mothers and babies")}
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {roles.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center justify-center gap-2.5 text-[13px] font-medium text-neutral-600">
              <Icon className="h-4 w-4 text-primary-500" />
              {label}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ------------------------------ Stats ------------------------------ */
export function StatsSection() {
  const { t } = useTranslation();
  const stats = [
    { value: "0", label: t("landing.stats.paper", "paper registers to carry, copy or lose") },
    { value: "1", label: t("landing.stats.list", "shared list of who is due, updated after every visit") },
  ];
  return (
    <section id="about" className="scroll-mt-20 py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <motion.h2 {...fadeUp} className="max-w-md text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl">
          {t("landing.stats.title1", "One record for every")}{" "}
          <span className="italic text-primary">{t("landing.stats.title2", "mother and child,")}</span>{" "}
          {t("landing.stats.title3", "from first visit to first birthday.")}
        </motion.h2>
        <div className="grid grid-cols-2 divide-x divide-border">
          {stats.map((s, i) => (
            <motion.div key={s.value} {...fadeUp} transition={{ delay: i * 0.1 }} className="px-6 first:pl-0">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <p className="mt-4 font-display text-6xl font-semibold text-brand-navy">{s.value}</p>
              <p className="mt-2 max-w-[14rem] text-[13px] leading-relaxed text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* --------------------------- How it works -------------------------- */
export function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    { icon: UsersRound, title: t("landing.how.s1", "Register the mother"), body: t("landing.how.s1b", "Name, ID, village and due date, entered once at the first visit.") },
    { icon: NotebookPen, title: t("landing.how.s2", "Record each visit"), body: t("landing.how.s2b", "Antenatal checks, the birth, postnatal care and every vaccine.") },
    { icon: ListChecks, title: t("landing.how.s3", "See who is due"), body: t("landing.how.s3b", "Upcoming and overdue visits in one list, so no one is missed.") },
    { icon: FileSpreadsheet, title: t("landing.how.s4", "Share the report"), body: t("landing.how.s4b", "Monthly numbers ready for the supervisor, without counting by hand.") },
  ];
  return (
    <section id="how" className="scroll-mt-20 py-20">
      <Container>
        <div className="text-center">
          <p className="eyebrow">{t("landing.how.eyebrow", "How it works")}</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            {t("landing.how.title", "Four steps, one shared record")}
          </h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className="card-surface group p-5 transition hover:-translate-y-0.5 hover:shadow-float"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-[12px] font-semibold text-primary">0{i + 1}</span>
                <Icon className="h-4 w-4 text-neutral-400 transition group-hover:text-primary" />
              </div>
              <h3 className="mt-6 text-[15px] font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ----------------------------- Features ---------------------------- */
function GrowthSparkline() {
  const pts = [
    [8, 92],
    [70, 78],
    [140, 62],
    [230, 40],
  ];
  return (
    <svg viewBox="0 0 240 110" className="mt-6 w-full" aria-hidden>
      <path d="M8 70 L230 18 L230 52 L8 100 Z" className="fill-primary-100/60" />
      <polyline
        points={pts.map((p) => p.join(",")).join(" ")}
        fill="none"
        strokeWidth="2"
        className="stroke-primary"
      />
      {pts.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4" className="fill-white stroke-primary" strokeWidth="2" />
      ))}
    </svg>
  );
}

export function FeatureGrid() {
  const { t } = useTranslation();
  const visits = [
    { title: "Visit 1 · 12 wk", body: "Blood tests, BP", status: "Done", tone: "done" },
    { title: "Visit 2 · 20 wk", body: "Weight, iron", status: "Done", tone: "done" },
    { title: "Visit 3 · 28 wk", body: "BP, baby growth", status: "Overdue", tone: "overdue" },
    { title: "Visit 4 · 36 wk", body: "Birth plan", status: "Upcoming", tone: "upcoming" },
  ];
  const report = [
    { label: "New pregnancies", value: "00" },
    { label: "ANC visits", value: "00" },
    { label: "Births", value: "00" },
    { label: "Vaccines given", value: "00" },
  ];
  return (
    <section id="features" className="scroll-mt-20 py-20">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-md text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {t("landing.features.title1", "Everything a health worker checks,")}{" "}
            <span className="italic text-primary">{t("landing.features.title2", "in one place")}</span>
          </h2>
          <p className="max-w-sm text-[13px] leading-relaxed text-muted-foreground">
            {t(
              "landing.features.subtitle",
              "From the first antenatal visit to the last childhood vaccine, each step is recorded once and visible to the whole care team."
            )}
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {/* Antenatal timeline */}
          <motion.div {...fadeUp} className="card-surface p-6 lg:col-span-2">
            <h3 className="text-[15px] font-semibold text-foreground">{t("landing.features.anc", "Antenatal visits on a timeline")}</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {t("landing.features.ancb", "See what was checked at each visit and what comes next.")}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {visits.map((v) => (
                <div
                  key={v.title}
                  className={cn(
                    "rounded-xl border p-3",
                    v.tone === "done" && "border-primary-100 bg-primary-50/60",
                    v.tone === "overdue" && "border-warning-200 bg-warning-50",
                    v.tone === "upcoming" && "border-border bg-card"
                  )}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{v.title}</p>
                  <p className="mt-1 text-[13px] font-semibold text-foreground">{v.body}</p>
                  <p
                    className={cn(
                      "mt-1 text-[11px] font-medium",
                      v.tone === "done" && "text-primary-700",
                      v.tone === "overdue" && "text-warning-700",
                      v.tone === "upcoming" && "text-muted-foreground"
                    )}
                  >
                    {v.status}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Vaccination */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-navy-panel relative overflow-hidden rounded-2xl p-6 text-white shadow-float">
            <div className="bg-stars absolute inset-0 opacity-60" />
            <div className="relative">
              <h3 className="text-[15px] font-semibold">{t("landing.features.vacc", "Vaccination schedule")}</h3>
              <p className="mt-1 text-[13px] text-white/70">
                {t("landing.features.vaccb", "Every dose for every child, with the next one flagged.")}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["BCG", "Polio 0", "Penta 1"].map((d) => (
                  <span key={d} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium ring-1 ring-inset ring-white/20">
                    ✓ {d}
                  </span>
                ))}
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-brand-navy">
                  Penta 2 · due Thu
                </span>
                <span className="rounded-full px-3 py-1 text-[11px] text-white/60 ring-1 ring-inset ring-white/15">
                  Measles · 9 mo
                </span>
              </div>
            </div>
          </motion.div>

          {/* Growth */}
          <motion.div {...fadeUp} className="card-surface p-6">
            <h3 className="text-[15px] font-semibold text-foreground">{t("landing.features.growth", "Child growth")}</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {t("landing.features.growthb", "Weight at each visit against the healthy range.")}
            </p>
            <GrowthSparkline />
          </motion.div>

          {/* Report */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="card-surface p-6 lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[15px] font-semibold text-foreground">{t("landing.features.report", "Monthly report in one click")}</h3>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {t("landing.features.reportb", "The numbers supervisors ask for, counted for you.")}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-[12px] font-semibold text-primary-700">
                <CalendarClock className="h-3.5 w-3.5" />
                Export report
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {report.map((r) => (
                <div key={r.label} className="rounded-xl border border-border bg-background p-4">
                  <p className="text-[11px] text-muted-foreground">{r.label}</p>
                  <p className="mt-2 font-display text-2xl font-semibold text-foreground">[ {r.value} ]</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------- CTA ------------------------------- */
export function CtaBanner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="py-20">
      <Container>
        <motion.div
          {...fadeUp}
          className="bg-navy-panel relative overflow-hidden rounded-3xl px-6 py-16 text-center text-white shadow-float sm:px-12"
        >
          <div className="bg-stars absolute inset-0 opacity-70" />
          <div className="relative">
            <h2 className="text-3xl font-semibold sm:text-5xl">
              {t("landing.cta.title1", "See KuzaHealth")}{" "}
              <span className="italic text-primary-200">{t("landing.cta.title2", "in action")}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-white/75">
              {t(
                "landing.cta.subtitle",
                "Sign in and try a full visit, from registering a mother to the monthly report."
              )}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate("/auth/signin")}
                className="rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-brand-navy shadow-sm hover:bg-primary-50"
              >
                {t("landing.cta.primary", "Sign in")}
              </button>
              <button
                onClick={() => navigate("/auth/signup")}
                className="rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-[13px] font-medium text-white hover:bg-white/10"
              >
                {t("landing.cta.secondary", "Create an account")}
              </button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

/* ------------------------------ Footer ------------------------------ */
export function LandingFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border py-8">
      <Container className="flex flex-col items-center justify-between gap-4 text-[12px] text-muted-foreground sm:flex-row">
        <Logo />
        <p>© {new Date().getFullYear()} KuzaHealth</p>
        <div className="flex gap-5">
          <a href="#how" className="hover:text-foreground">{t("landing.nav.how", "How it works")}</a>
          <a href="#features" className="hover:text-foreground">{t("landing.nav.features", "Features")}</a>
          <a href="/auth/signin" className="hover:text-foreground">{t("landing.nav.signin", "Sign in")}</a>
        </div>
      </Container>
    </footer>
  );
}
