// src/components/common/Button.tsx
import React from 'react';
import classNames from 'classnames';

/**
 * Props for the Button component
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Button content */
  children: React.ReactNode;
  
  /** Whether the button should take the full width */
  fullWidth?: boolean;
  
  /** Whether the button is in loading state */
  isLoading?: boolean;
  
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Button component that supports various variants and sizes
 * 
 * @example
 * ```tsx
 * <Button 
 *   variant="primary" 
 *   size="lg" 
 *   onClick={() => console.log('Clicked!')}
 * >
 *   Click Me
 * </Button>
 * ```
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  ...rest
}) => {
  // Base classes that apply to all buttons
  const baseClasses = 'font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm rounded-lg',
    md: 'py-3 px-6 text-base rounded-lg',
    lg: 'py-3.5 px-7 text-base rounded-full',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-700 text-primary-foreground shadow-sm hover:shadow-float focus:ring-ring',
    secondary: 'bg-brand-navy hover:bg-primary-900 text-white shadow-sm focus:ring-ring',
    outline: 'border border-border bg-card text-foreground hover:bg-muted focus:ring-ring',
    text: 'text-primary-600 hover:text-primary-700 hover:bg-primary-50 focus:ring-primary-500',
  };
  
  // Loading and disabled states
  const stateClasses = (isLoading || disabled) 
    ? 'opacity-70 cursor-not-allowed'
    : 'cursor-pointer';
  
  // Full width option
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = classNames(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    stateClasses,
    widthClasses,
    className
  );
  
  return (
    <button
      className={buttonClasses}
      disabled={isLoading || disabled}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;