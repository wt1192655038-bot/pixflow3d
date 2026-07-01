import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pixflow3d.com"),
  title: "Pixflow｜像素流动",
  description: "一个专注 Blender 特效与物理模拟的视觉实验室。",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  openGraph: {
    title: "Pixflow｜像素流动",
    description: "Blender 特效与物理模拟视觉实验室，提供教程、工程文件与视觉案例拆解。",
    url: "https://pixflow3d.com",
    siteName: "Pixflow｜像素流动",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pixflow｜像素流动"
      }
    ],
    locale: "zh_CN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixflow｜像素流动",
    description: "Blender 特效与物理模拟视觉实验室，提供教程、工程文件与视觉案例拆解。",
    images: ["/og-image.png"]
  }
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
