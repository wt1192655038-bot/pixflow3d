import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  children,
  className = "",
  href,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  const classes =
    variant === "primary"
      ? "bg-lab-blue2 text-white hover:bg-blue-500"
      : "border border-lab-line bg-white/5 text-slate-100 hover:bg-white/10";

  const mergedClassName = `inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition ${classes} ${className}`;

  if (href.startsWith("http")) {
    return (
      <a href={href} className={mergedClassName} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={mergedClassName}>
      {children}
    </Link>
  );
}
