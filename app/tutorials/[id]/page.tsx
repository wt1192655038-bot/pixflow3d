import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ButtonLink";
import { getTutorialById } from "@/lib/data";

export const dynamic = "force-dynamic";

type TutorialDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TutorialDetailPage({
  params
}: TutorialDetailPageProps) {
  const { id } = await params;
  const tutorial = getTutorialById(id);

  if (!tutorial) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg border border-lab-line bg-lab-panel">
        <div className="aspect-video bg-black">
          <iframe
            src={tutorial.videoUrl}
            title={tutorial.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="space-y-6 p-6 sm:p-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white">{tutorial.title}</h1>
            <p className="max-w-3xl leading-7 text-slate-300">
              {tutorial.desc}
            </p>
          </div>
          <ButtonLink
            href={tutorial.r2FileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            下载工程文件
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
