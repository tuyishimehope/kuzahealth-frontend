import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Building2, Database, GraduationCap, Info, ShieldAlert, X } from "lucide-react";

const SEEN_KEY = "kuzahealth.projectNoticeSeen";

const POINTS = [
  {
    icon: GraduationCap,
    title: "A personal learning project",
    body: "KuzaHealth was built to learn and practise software development. It isn't a real health service.",
  },
  {
    icon: Database,
    title: "All data is synthetic",
    body: "Every mother, child, visit and figure here is made up. None of it describes real people.",
  },
  {
    icon: Building2,
    title: "Not affiliated with any government",
    body: "It isn't connected to, or endorsed by, any government, ministry of health or health facility.",
  },
  {
    icon: ShieldAlert,
    title: "Don't enter real information",
    body: "Please don't type real names, ID numbers or medical details, and don't use it for patient care.",
  },
];

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage unavailable: the notice simply shows again next time */
  }
}

/**
 * Disclaimer shown on the sign-in and sign-up pages. Opens automatically once
 * per browser session; the returned link lets people reopen it at any time.
 */
export default function ProjectNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!readSeen()) {
      const id = window.setTimeout(() => setOpen(true), 400);
      return () => window.clearTimeout(id);
    }
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) markSeen();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="mx-auto mt-6 flex items-center gap-1.5 text-[12px] text-muted-foreground transition hover:text-foreground"
        >
          <Info className="h-3.5 w-3.5" />
          Personal learning project · synthetic data
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-brand-midnight/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 outline-none"
          aria-describedby="project-notice-desc"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-float"
          >
            <div className="bg-navy-panel relative px-6 pb-5 pt-6 text-white">
              <div className="bg-stars absolute inset-0 opacity-60" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-inset ring-white/20">
                  <Info className="h-3.5 w-3.5" />
                  Please read
                </span>
                <Dialog.Title className="mt-3 font-display text-2xl font-semibold leading-tight">
                  Before you continue
                </Dialog.Title>
                <p id="project-notice-desc" className="mt-1.5 text-[13px] leading-relaxed text-white/75">
                  A few things to know about this site.
                </p>
              </div>
              <Dialog.Close
                aria-label="Close"
                className="absolute right-4 top-4 rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <ul className="space-y-4 px-6 py-5">
              {POINTS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">{title}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border bg-muted/40 px-6 py-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  autoFocus
                  className="h-11 w-full rounded-xl bg-primary text-[14px] font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/25"
                >
                  I understand
                </button>
              </Dialog.Close>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
