import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import Logo from "@/components/common/Logo";
import { cn } from "@/lib/utils";

interface AuthShowcaseProps {
  title: string;
  description?: string;
  /** Tailwind width/visibility classes for the panel column */
  className?: string;
}

const SAMPLE = [
  { initials: "UA", name: "Uwase Aline", tag: "ANC 3 overdue", tone: "bg-warning-50 text-warning-700" },
  { initials: "MG", name: "Mukamana Grace", tag: "Penta 2 · Thu", tone: "bg-info-50 text-info-700" },
  { initials: "NC", name: "Niyonsaba Claudine", tag: "Postnatal check", tone: "bg-success-50 text-success-700" },
];

/**
 * Left-hand brand panel shared by all auth screens: deep navy gradient,
 * star field, headline and a small sample of the product.
 */
export default function AuthShowcase({ title, description, className }: AuthShowcaseProps) {
  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "bg-navy-panel relative hidden overflow-hidden text-white lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12",
        className
      )}
    >
      <div className="bg-stars absolute inset-0 opacity-80" />
      <div className="absolute -bottom-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-primary-500/40 blur-3xl" />

      <Logo tone="light" className="relative" />

      <div className="relative max-w-md">
        <h2 className="text-4xl font-semibold leading-[1.05] xl:text-5xl">{title}</h2>
        {description && (
          <p className="mt-4 text-[15px] leading-relaxed text-white/75">{description}</p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-10 rounded-2xl bg-white/95 p-2 text-foreground shadow-float backdrop-blur"
        >
          <div className="flex items-center justify-between px-3 py-2 text-[12px]">
            <span className="font-semibold">Due this week</span>
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-700">
              Sample
            </span>
          </div>
          <ul>
            {SAMPLE.map((m) => (
              <li key={m.name} className="flex items-center gap-3 rounded-xl px-3 py-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-100 text-[10px] font-semibold text-primary-700">
                  {m.initials}
                </span>
                <span className="flex-1 text-[13px] font-medium">{m.name}</span>
                <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold", m.tone)}>{m.tag}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <p className="relative flex items-center gap-2 text-[12px] text-white/60">
        <ShieldCheck className="h-4 w-4" />
        Patient records are private to your health facility.
      </p>
    </motion.aside>
  );
}
