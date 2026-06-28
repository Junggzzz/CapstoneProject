import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 ease-out rounded-sm";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: "bg-[var(--color-accent)] text-black hover:brightness-110 hover:-translate-y-0.5 shadow-lg shadow-[var(--color-accent)]/20",
    secondary: "bg-[var(--color-secondary)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/30 hover:-translate-y-0.5",
    outline: "border border-[var(--color-muted)] text-[var(--color-foreground)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
    ghost: "text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-transparent hover:bg-white/5",
  };

  const combinedClassName = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className
  );

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={combinedClassName}>
      {children}
    </button>
  );
}
