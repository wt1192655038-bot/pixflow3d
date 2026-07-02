"use client";

import { useState } from "react";

const resourceTags = [
  "火焰",
  "烟雾",
  "破碎",
  "流体",
  "粒子",
  "光影",
  "AI",
  "物理模拟",
  "几何节点",
  "材质",
  "软体",
  "刚体"
];

export function AdminTagSelector({
  selectedTags = []
}: {
  selectedTags?: string[];
}) {
  const [selected, setSelected] = useState(() => new Set(selectedTags));

  function toggleTag(tag: string) {
    setSelected((current) => {
      const next = new Set(current);

      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }

      return next;
    });
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-[#273653]">标签</legend>
      <div className="flex flex-wrap gap-2">
        {resourceTags.map((tag) => {
          const isSelected = selected.has(tag);

          return (
            <div key={tag} className="contents">
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isSelected
                    ? "border-[#89a7ff] bg-[#eef3ff] text-[#4f68f5] shadow-[0_8px_18px_rgba(79,104,245,0.12)]"
                    : "border-slate-200 bg-white text-[#465a78] hover:border-cyan-200 hover:bg-cyan-50 hover:text-[#0e99be]"
                }`}
              >
                {tag}
              </button>
              {isSelected ? (
                <input type="hidden" name="tags" value={tag} />
              ) : null}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
