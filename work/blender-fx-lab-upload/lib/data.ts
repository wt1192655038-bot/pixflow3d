import { readFileSync } from "fs";
import path from "path";

export type Tutorial = {
  id: number;
  title: string;
  desc: string;
  videoUrl: string;
  thumbnailUrl: string;
  r2FileUrl: string;
};

export type DownloadFile = {
  name: string;
  type: string;
  size: string;
  url: string;
};

function readJsonFile<T>(fileName: string, fallback: T): T {
  try {
    const filePath = path.join(process.cwd(), "data", fileName);
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

export function getTutorials(): Tutorial[] {
  return readJsonFile<Tutorial[]>("tutorials.json", []);
}

export function getLatestTutorials(limit = 3): Tutorial[] {
  return getTutorials().slice(0, limit);
}

export function getTutorialById(id: string): Tutorial | undefined {
  return getTutorials().find((tutorial) => String(tutorial.id) === id);
}

export function getFiles(): DownloadFile[] {
  return readJsonFile<DownloadFile[]>("files.json", []);
}
