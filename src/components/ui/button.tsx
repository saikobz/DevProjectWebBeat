import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-lime-300 text-zinc-950 hover:bg-lime-200",
  secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
  ghost: "bg-transparent text-zinc-200 hover:bg-zinc-800"
};

type BaseProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkButtonProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button({ children, variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn("inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition", variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({ children, href, variant = "primary", className, ...props }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition", variants[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
