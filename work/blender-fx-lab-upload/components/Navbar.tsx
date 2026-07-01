import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/files", label: "Files" },
  { href: "/about", label: "About" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-lab-line bg-lab-bg/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-white">
          Blender FX Lab
        </Link>
        <div className="flex flex-wrap gap-2 text-sm text-slate-300">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
