"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAbout = pathname === "/about";
  const baseLinkClass = "relative px-2 py-3 transition hover:text-[#168ad8]";
  const activeLinkClass =
    "text-[#10213f] after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-7 after:-translate-x-1/2 after:rounded-full after:bg-gradient-to-r after:from-[#13d0d9] after:to-[#4979ff]";

  return (
    <header className="relative z-20 border-b border-slate-100 bg-white/[0.92] shadow-[0_10px_34px_rgba(33,60,112,0.08)] backdrop-blur-xl">
      <nav className="flex w-full items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Pixflow 首页">
            <img
              src="/images/pixflow-logo.png"
              alt="Pixflow"
              className="h-10 w-auto sm:h-14"
            />
          </Link>

          <div className="flex items-center gap-2 text-sm font-semibold text-[#1c2d4a] sm:gap-5 sm:text-base">
            <Link
              href="/"
              className={`${baseLinkClass} ${isHome ? activeLinkClass : ""}`}
            >
              首页
            </Link>
            <Link
              href="/about"
              className={`${baseLinkClass} ${isAbout ? activeLinkClass : ""}`}
            >
              关于
            </Link>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-sm font-semibold sm:gap-4 sm:text-base">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="hidden cursor-not-allowed rounded-xl bg-slate-100 px-5 py-3 text-slate-400 opacity-70 shadow-inner sm:inline-flex"
          >
            登录
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="hidden cursor-not-allowed rounded-xl bg-slate-100 px-5 py-3 text-slate-400 opacity-70 shadow-inner sm:inline-flex"
          >
            注册
          </button>
        </div>
      </nav>
    </header>
  );
}
