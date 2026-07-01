import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blender FX Lab",
  description: "Blender simulation tutorials and downloadable project files."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-lab-bg antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
