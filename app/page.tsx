import { ResourceFilterSection } from "@/components/ResourceFilterSection";
import { getFiles } from "@/lib/data";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function HomePage() {
  const fileCards = await getFiles();

  return (
    <div className="pixflow-home min-h-screen overflow-hidden">
      <section className="hero-section relative min-h-[560px] overflow-hidden">
        <img
          src="/images/pixflow-hero-bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 px-5 pb-12 pt-12 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:pb-16 lg:pt-20">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-white/80 bg-gradient-to-r from-cyan-50 to-violet-100 px-6 py-2 text-sm font-semibold tracking-wide text-[#0d8fbd] shadow-sm sm:text-base">
              专注 Blender 特效教学
            </p>
            <h1 className="mt-7 text-5xl font-black leading-tight tracking-normal text-[#071b38] sm:text-6xl lg:text-7xl">
              轻量高效的
              <span className="mt-2 block">Blender 特效教程库</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#657188] sm:text-lg">
              从基础到进阶，系统学习 Blender VFX 与模拟特效
              <br className="hidden sm:block" />
              火焰、烟雾、破碎、大气、流体、粒子等实战技巧全掌握
            </p>
          </div>

          <div className="min-h-[280px] lg:min-h-[500px]" aria-hidden="true" />
        </div>
      </section>

      <ResourceFilterSection files={fileCards} />
    </div>
  );
}
