import { ButtonLink } from "@/components/ButtonLink";
import { getFiles } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function FilesPage() {
  const files = getFiles();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold text-white">Files</h1>
        <p className="max-w-2xl text-slate-300">
          所有下载链接都指向 Cloudflare R2 文件地址，前端只保存 direct URL。
        </p>
      </div>
      <div className="grid gap-4">
        {files.map((file) => (
          <article
            key={file.url}
            className="flex flex-col gap-5 rounded-lg border border-lab-line bg-lab-panel p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">{file.name}</h2>
              <div className="flex flex-wrap gap-2 text-sm text-slate-400">
                <span className="rounded-md bg-white/5 px-3 py-1">
                  {file.size}
                </span>
                <span className="rounded-md bg-white/5 px-3 py-1">
                  {file.type}
                </span>
              </div>
            </div>
            <ButtonLink
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:w-auto"
            >
              下载
            </ButtonLink>
          </article>
        ))}
      </div>
    </section>
  );
}
