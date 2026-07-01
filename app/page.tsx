import { getDownloadCoverUrl, getFiles } from "@/lib/data";

const previewClasses = [
  "preview-fire",
  "preview-fog",
  "preview-fracture",
  "preview-light",
  "preview-thruster",
  "preview-particles"
];

export const dynamic = "force-dynamic";
export const runtime = "edge";

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

export default async function HomePage() {
  const fileCards = (await getFiles()).slice(0, 6);

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

      <section className="mx-auto mt-[50px] max-w-7xl px-5 pb-12 sm:px-8 lg:pb-16">
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {fileCards.map((file, index) => {
            const coverUrl = getDownloadCoverUrl(file);

            return (
            <article
              key={file.id}
              className="group"
            >
              <a
                href={`/resources/${file.id}`}
                aria-label={`查看 ${file.title} 视频播放页`}
                className="block"
              >
                <div className={`preview-window aspect-[4/3] ${coverUrl ? "" : previewClasses[index % previewClasses.length]}`}>
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={file.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
              </a>
              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <a href={`/resources/${file.id}`}>
                    <h2 className="text-sm font-semibold text-[#1f2d48] transition hover:text-[#0e99be]">
                      {file.title}
                    </h2>
                  </a>
                  <p className="mt-1 text-xs font-medium text-[#8a96aa]">
                    {file.file_size}
                  </p>
                </div>
                <a
                  href={file.download_url}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#14b8d4] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#0e99be] transition hover:bg-cyan-50"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DownloadIcon />
                  下载
                </a>
              </div>
            </article>
          );
          })}
        </div>
      </section>
    </div>
  );
}
