"use client";

import { useMemo, useState } from "react";
import type { DownloadFile } from "@/lib/data";

const filterTags = [
  "全部",
  "火焰",
  "烟雾",
  "破碎",
  "流体",
  "粒子",
  "光影",
  "AI",
  "物理模拟"
];

const previewClasses = [
  "preview-fire",
  "preview-fog",
  "preview-fracture",
  "preview-light",
  "preview-thruster",
  "preview-particles"
];

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

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function getCoverUrl(file: DownloadFile) {
  if (file.cover_url) {
    return file.cover_url;
  }

  if (file.bvid) {
    return `https://i2.hdslb.com/bfs/archive/${file.bvid}.jpg`;
  }

  return "";
}

function matchesSearch(file: DownloadFile, query: string) {
  if (!query) {
    return true;
  }

  const text = [
    file.title,
    file.description,
    file.name,
    file.type,
    ...file.tags
  ]
    .join(" ")
    .toLowerCase();

  return text.includes(query.toLowerCase());
}

function matchesTag(file: DownloadFile, tag: string) {
  return tag === "全部" || file.tags.includes(tag);
}

export function ResourceFilterSection({ files }: { files: DownloadFile[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("全部");

  const filteredFiles = useMemo(
    () =>
      files.filter(
        (file) => matchesTag(file, activeTag) && matchesSearch(file, query.trim())
      ),
    [activeTag, files, query]
  );

  return (
    <section className="mx-auto mt-[50px] max-w-7xl px-5 pb-12 sm:px-8 lg:pb-16">
      <div className="mb-10 rounded-[28px] border border-white bg-white/90 p-3 shadow-[0_18px_50px_rgba(47,83,143,0.10)] backdrop-blur">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative flex min-h-12 flex-1 items-center">
            <span className="pointer-events-none absolute left-5 text-[#9aabc6]">
              <SearchIcon />
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索特效、技术或关键词..."
              className="h-12 w-full rounded-2xl border border-transparent bg-[#f4f8ff] pl-12 pr-4 text-sm font-semibold text-[#1f2d48] outline-none transition placeholder:text-[#9aa9c2] focus:border-[#91ddf4] focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:text-base"
            />
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
            {filterTags.map((tag) => {
              const isActive = activeTag === tag;

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`h-11 shrink-0 rounded-full border px-5 text-sm font-bold transition ${
                    isActive
                      ? "border-[#9fb8ff] bg-white text-[#4f68f5] shadow-[0_8px_22px_rgba(79,104,245,0.18)]"
                      : "border-slate-200 bg-[#f3f6fb] text-[#32415d] hover:border-cyan-200 hover:bg-cyan-50 hover:text-[#0e99be]"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filteredFiles.length > 0 ? (
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {filteredFiles.map((file, index) => {
            const coverUrl = getCoverUrl(file);

            return (
              <article key={file.id} className="group">
                <a
                  href={`/resources/${file.id}`}
                  aria-label={`查看 ${file.title} 视频播放页`}
                  className="block"
                >
                  <div
                    className={`preview-window aspect-[4/3] ${
                      coverUrl ? "" : previewClasses[index % previewClasses.length]
                    }`}
                  >
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
      ) : (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/70 px-6 py-14 text-center text-sm font-semibold text-[#7b879c]">
          没有找到匹配的资源
        </div>
      )}
    </section>
  );
}
