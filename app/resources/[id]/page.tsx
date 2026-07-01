import { notFound } from "next/navigation";
import { getDownloadCoverUrl, getFiles } from "@/lib/data";

export const dynamic = "force-dynamic";
export const runtime = "edge";

type ResourceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function normalizeVideoUrl(url: string) {
  if (!url) {
    return "";
  }

  if (url.includes("player.bilibili.com") || url.includes("youtube.com/embed")) {
    return url;
  }

  const bvidMatch = url.match(/BV[0-9A-Za-z]+/);

  if (bvidMatch) {
    return `https://player.bilibili.com/player.html?bvid=${bvidMatch[0]}`;
  }

  return url;
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M12 3v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 19h14" />
    </svg>
  );
}

export default async function ResourceDetailPage({
  params
}: ResourceDetailPageProps) {
  const { id } = await params;
  const resources = await getFiles();
  const resource = resources.find((item) => item.id === id);

  if (!resource) {
    notFound();
  }

  const videoUrl = normalizeVideoUrl(resource.video_url || "");
  const coverUrl = getDownloadCoverUrl(resource);

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
      <a
        href="/"
        className="text-sm font-semibold text-[#0e99be] transition hover:text-[#0b7f9d]"
      >
        返回首页
      </a>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="overflow-hidden rounded-3xl bg-slate-950 shadow-[0_24px_70px_rgba(15,35,70,0.18)]">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              title={resource.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="aspect-video w-full"
            />
          ) : coverUrl ? (
            <img
              src={coverUrl}
              alt={resource.title}
              className="aspect-video w-full object-cover"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center px-6 text-center text-sm font-semibold text-slate-300">
              暂未配置视频链接
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-white/80 bg-white p-6 shadow-[0_18px_45px_rgba(26,52,96,0.12)]">
          <p className="text-sm font-semibold text-[#0e99be]">Pixflow 资源</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-[#10213f]">
            {resource.title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#657188]">
            {resource.description || "暂无简介"}
          </p>
          <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-[#607086]">
            文件大小：{resource.file_size}
          </div>
          <a
            href={resource.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0ea5c6] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0793b5]"
          >
            <DownloadIcon />
            下载工程文件
          </a>
        </aside>
      </div>
    </section>
  );
}
