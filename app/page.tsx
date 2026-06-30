import { ButtonLink } from "@/components/ButtonLink";
import { TutorialCard } from "@/components/TutorialCard";
import { getLatestTutorials } from "@/lib/data";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function HomePage() {
  const tutorials = await getLatestTutorials(3);

  return (
    <div>
      <section className="border-b border-lab-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase text-lab-blue">
                Blender FX Lab
              </p>
              <h1 className="max-w-3xl text-4xl font-bold text-white sm:text-5xl">
                Blender 特效教程与工程文件
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                分享雾效、火焰、流体、软体等Blender特效教程，并提供工程文件下载
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/tutorials">观看教程</ButtonLink>
              <ButtonLink href="/files" variant="secondary">
                下载文件
              </ButtonLink>
            </div>
          </div>
          <div className="min-h-80 overflow-hidden rounded-lg border border-lab-line bg-lab-panel">
            <img
              src="/images/fluid.svg"
              alt="Blender fluid effect preview"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">最新教程</h2>
            <p className="mt-2 text-sm text-slate-400">
              从 JSON 数据读取的最新 3 个 Blender 特效教程
            </p>
          </div>
          <ButtonLink href="/tutorials" variant="secondary">
            查看全部
          </ButtonLink>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {tutorials.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </div>
      </section>
    </div>
  );
}
