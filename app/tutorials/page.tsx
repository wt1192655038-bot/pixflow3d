import { TutorialCard } from "@/components/TutorialCard";
import { getTutorials } from "@/lib/data";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function TutorialsPage() {
  const tutorials = await getTutorials();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold text-white">Tutorials</h1>
        <p className="max-w-2xl text-slate-300">
          浏览所有 Blender 特效教程，进入详情页观看视频并下载对应工程文件。
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tutorials.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </div>
    </section>
  );
}
