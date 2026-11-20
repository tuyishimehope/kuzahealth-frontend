import { cn } from "@/lib/utils";
import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import React, { forwardRef, useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import AuthShowcase from "@/components/auth/AuthShowcase";

const schema = z
  .object({
    email: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    token: z.string().nonempty("Token is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

// Password strength checker
const getPasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const strength = score < 2 ? "weak" : score < 4 ? "medium" : "strong";

  return { checks, score, strength };
};

// Enhanced types with better composition

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  label: string;
  value?: string;
  error?: string;
  showStrength?: boolean;
  showToggle?: boolean;
  helperText?: string;
  required?: boolean;
  // Enhanced validation props
  confirmValue?: string; // For password confirmation matching
  showConfirmation?: boolean;
  // Styling props
  variant?: "default" | "compact";
  strengthPosition?: "below" | "inline";
}

// Confirmation status component
const ConfirmationStatus: React.FC<{
  isMatching: boolean;
  showWhenEmpty?: boolean;
}> = ({ isMatching, showWhenEmpty = false }) => {
  if (!showWhenEmpty && !isMatching) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex items-center gap-2 text-sm",
        isMatching ? "text-success-600" : "text-neutral-500"
      )}
    >
      {isMatching && <CheckCircle2 className="h-4 w-4" />}
      <span>{isMatching ? "Passwords match" : ""}</span>
    </motion.div>
  );
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      value = "",
      error,
      showStrength = false,
      showToggle = true,
      helperText,
      required = false,
      confirmValue,
      showConfirmation = false,
      // variant = "default",
      strengthPosition = "below",
      className,
      id: providedId,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const id = providedId || generatedId;

    // Memoize expensive calculations
    const strength = useMemo(
      () => (showStrength ? getPasswordStrength(value) : null),
      [value, showStrength]
    );

    const isConfirmationMatching = useMemo(
      () =>
        showConfirmation && confirmValue
          ? value === confirmValue && value.length > 0
          : false,
      [value, confirmValue, showConfirmation]
    );

    // Build aria-describedby for accessibility
    const describedByIds = [];
    if (helperText) describedByIds.push(`${id}-helper`);
    if (error) describedByIds.push(`${id}-error`);
    if (showStrength && strength) describedByIds.push(`${id}-strength`);
    if (ariaDescribedBy) describedByIds.push(ariaDescribedBy);

    const inputClassName = cn(
      "w-full pl-11 py-3 rounded-lg border transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-opacity-50",
      "placeholder:text-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed",
      showToggle ? "pr-12" : "pr-4",
      error
        ? "border-danger-300 bg-danger-50 focus:border-danger-500 focus:ring-danger-200"
        : "border-neutral-200 bg-white focus:border-primary-500 focus:ring-primary-200",
      className
    );

    return (
      <div className="space-y-2">
        {/* Label */}
        <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
          {label}
          {required && (
            <span className="text-danger-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>

        {/* Helper text */}
        {helperText && (
          <p id={`${id}-helper`} className="text-sm text-neutral-600">
            {helperText}
          </p>
        )}

        {/* Input container */}
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400"
            aria-hidden="true"
          />

          <input
            ref={ref}
            id={id}
            type={showPassword ? "text" : "password"}
            value={value}
            className={inputClassName}
            aria-describedby={
              describedByIds.length > 0 ? describedByIds.join(" ") : undefined
            }
            aria-invalid={error ? "true" : "false"}
            aria-required={required}
            {...props}
          />

          {/* Toggle visibility button */}
          {showToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Inline strength indicator */}
          {showStrength &&
            value &&
            strength &&
            strengthPosition === "inline" && (
              <div className="absolute right-14 top-1/2 -translate-y-1/2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    strength.strength === "weak"
                      ? "bg-danger-500"
                      : strength.strength === "medium"
                      ? "bg-warning-500"
                      : "bg-success-500"
                  )}
                />
              </div>
            )}
        </div>

        {/* Password confirmation status */}
        {showConfirmation && (
          <ConfirmationStatus isMatching={isConfirmationMatching} />
        )}

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              id={`${id}-error`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-danger-600 text-sm"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle
                className="h-4 w-4 flex-shrink-0"
                aria-hidden="true"
              />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
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

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const password = watch("password", "");

  const confirmPassword = watch("confirmPassword", "");

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return axiosInstance.post("/api/v1/auth/reset-password", data);
    },
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/auth/signin");
      }, 3000);
    },
    onError: () => {},
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
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
  //     transition: { duration: 0.5, ease: "easeOut" },
  //   },
  // };

  if (showSuccess) {
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
            Password Updated!
          </h2>
          <p className="text-neutral-600 mb-8">
            Your password has been successfully updated. You'll be redirected to
            the login page in a moment.
          </p>
          <div className="w-full bg-neutral-200 rounded-full h-1 mb-4">
            <motion.div
              className="bg-primary-600 h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <AuthShowcase
          title="Choose a new password"
          description="Pick something strong and memorable to protect your patients' records."
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
                onClick={() => navigate("/auth/forgot-password")}
                className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-8 group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back
              </button>

              <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                Create New Password
              </h2>
              <p className="text-neutral-600">
                Choose a strong password to keep your account secure.
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="flex flex-col space-y-1">
                <label htmlFor="token">Email</label>
                <input
                  id="email"
                  type="text"
                  placeholder="Enter Email"
                  {...register("email")}
                  className={`field w-full pl-11 pr-12 ${ errors.email ? "field-invalid" : "" }`}
                />
                {errors.email && (
                  <p className="text-sm text-danger-500">{errors.email.message}</p>
                )}
              </div>
              <PasswordInput
                label="New Password"
                placeholder="Create a strong password"
                // showStrength={true}
                value={password}
                error={errors.password?.message}
                {...register("password")}
              />

              <PasswordInput
                label="Confirm Password"
                value={confirmPassword}
                confirmValue={password} // ✅ for confirmation match logic
                showConfirmation
                placeholder="Confirm your new password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <div className="flex flex-col space-y-1">
                <label htmlFor="token">Reset Token</label>
                <input
                  id="token"
                  type="text"
                  placeholder="Enter token"
                  {...register("token")}
                  className={`field w-full pl-11 pr-12 ${ errors.token ? "field-invalid" : "" }`}
                />
                {errors.token && (
                  <p className="text-sm text-danger-500">{errors.token.message}</p>
                )}
              </div>

              <Button
                type="submit"
                loading={mutation.isPending}
                disabled={mutation.isPending || !isValid}
              >
                {mutation.isPending
                  ? "Updating Password..."
                  : "Update Password"}
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

export default CreateNewPassword;
