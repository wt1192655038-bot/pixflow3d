import { ButtonLink } from "@/components/ButtonLink";
import type { Tutorial } from "@/lib/data";

type TutorialCardProps = {
  tutorial: Tutorial;
};

export function TutorialCard({ tutorial }: TutorialCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-lab-line bg-lab-panel shadow-sm shadow-black/20">
      <div className="relative aspect-video bg-lab-panel2">
        <img
          src={tutorial.thumbnailUrl}
          alt={tutorial.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{tutorial.title}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-slate-300">
            {tutorial.desc}
          </p>
        </div>
        <ButtonLink href={`/tutorials/${tutorial.id}`}>查看教程</ButtonLink>
      </div>
    </article>
  );
}
