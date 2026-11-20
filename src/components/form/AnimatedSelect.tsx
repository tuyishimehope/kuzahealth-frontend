import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import React from "react";

const itemVariants:Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

type Option = {
  label: string;
  value: string | number;
};

type AnimatedSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: Option[];
};

const AnimatedSelect = React.forwardRef<HTMLSelectElement, AnimatedSelectProps>(
  ({ label, error, options, ...props }, ref) => {
    return (
      <motion.div
        className="flex flex-col space-y-2"
        variants={itemVariants}
      >
        <label className="field-label !mb-0">{label}</label>
        <div className="relative">
          <select
            ref={ref}
            className={`field w-full ${ error ? "field-invalid" : "" }`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="field-error !mt-0"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);


AnimatedSelect.displayName = "AnimatedSelect";

export default AnimatedSelect;
