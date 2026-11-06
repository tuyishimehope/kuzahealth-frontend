import React from "react";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";


const itemVariants:Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

const AnimatedInput = React.forwardRef<HTMLInputElement, {
  label: string;
  error?: string;
  type?: string;
  placeholder?: string;
  name?: string;
}>(({ label, error, ...props }, ref) => {
  return (
    <motion.div 
      className="flex flex-col space-y-2"
      variants={itemVariants}
    >
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      <div className="relative">
        <input
          ref={ref} // Now ref works correctly!
          className={`w-full px-4 py-3 bg-neutral-50 border ${
            error ? "border-danger-300" : "border-neutral-200"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-danger-500 text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
});

AnimatedInput.displayName = "AnimatedInput"; // Required for forwardRef components

export default AnimatedInput;
