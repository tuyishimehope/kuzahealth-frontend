import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Mail,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import axios from "axios";
import AuthShowcase from "@/components/auth/AuthShowcase";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: LucideIcon;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled,
  icon: Icon,
  ...props
}) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`
        w-full px-4 py-3 rounded-lg border transition-all duration-200
        ${Icon ? "pl-11" : "pl-4"}
        ${
          error
            ? "border-danger-300 bg-danger-50 focus:border-danger-500 focus:ring-danger-200"
            : "border-neutral-200 bg-white focus:border-primary-500 focus:ring-primary-200"
        }
        focus:outline-none focus:ring-2 focus:ring-opacity-50
        disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
        placeholder:text-neutral-400
      `}
      {...props}
    />
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  onClick,
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm",
    secondary: "bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200",
    ghost: "hover:bg-neutral-100 text-neutral-600",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-lg font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98] transform
        ${className}
      `}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </span>
    </button>
  );
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/api/v1/auth/reset-password-request", {
        email,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // const itemVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { duration: 0.5, ease: "easeOut" }
  //   }
  // };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 text-center border border-border"
        >
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">
            Check your email
          </h2>
          <p className="text-neutral-600 mb-8">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate("/auth/reset-password")}
            className="w-full"
          >
            Back to Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <AuthShowcase
          title="Locked out? We'll get you back in."
          description="Enter your email and we'll send you a secure link to reset your password."
        />

        {/* Right side - Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <motion.div className="text-center lg:text-left">
              <button
                onClick={() => navigate("/auth/signin")}
                className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-8 group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to login
              </button>

              <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                Forgot your password?
              </h2>
              <p className="text-neutral-600">
                No problem. Just enter your email address and we'll send you a
                link to reset it.
              </p>
            </motion.div>

            {/* Form */}
            <motion.form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                  disabled={loading}
                  icon={Mail}
                  autoComplete="email"
                  autoFocus
                />
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-danger-600 text-sm"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Sending reset link..." : "Send reset link"}
              </Button>
            </motion.form>

            {/* Footer */}
            <motion.div className="text-center">
              <p className="text-neutral-600">
                Remember your password?{" "}
                <button
                  onClick={() => navigate("/auth/signin")}
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Sign in instead
                </button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
