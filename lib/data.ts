import filesSeed from "@/data/files.json";
import tutorialsSeed from "@/data/tutorials.json";

export type Tutorial = {
  id: number;
  title: string;
  desc: string;
  videoUrl: string;
  thumbnailUrl: string;
  r2FileUrl: string;
};

export type DownloadFile = {
  id: string;
  title: string;
  description: string;
  download_url: string;
  video_url?: string;
  bvid?: string;
  cover_url?: string;
  created_at: string;
  file_size: string;
  name: string;
  type: string;
  size: string;
  url: string;
};

type KVLike = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
};

type CloudflareEnv = {
  CONTENT_KV?: KVLike;
};

async function getContentKV(): Promise<KVLike | undefined> {
  try {
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    return (getRequestContext().env as CloudflareEnv).CONTENT_KV;
  } catch {
    return undefined;
  }
}

async function readCollection<T>(key: string, fallback: T): Promise<T> {
  const kv = await getContentKV();
  const raw = await kv?.get(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getTutorials(): Promise<Tutorial[]> {
  return readCollection<Tutorial[]>("tutorials", tutorialsSeed);
}

export async function getLatestTutorials(limit = 3): Promise<Tutorial[]> {
  return (await getTutorials()).slice(0, limit);
}

export async function getTutorialById(
  id: string
): Promise<Tutorial | undefined> {
  return (await getTutorials()).find((tutorial) => String(tutorial.id) === id);
}

export async function getFiles(): Promise<DownloadFile[]> {
  const files = await readCollection<Array<Partial<DownloadFile>>>(
    "files",
    filesSeed as Array<Partial<DownloadFile>>
  );

  return files.map((file, index) => normalizeDownloadFile(file, index));
}

export async function writeCollection<T>(key: string, data: T) {
  const kv = await getContentKV();

  if (!kv) {
    throw new Error("CONTENT_KV binding is required for admin writes.");
  }

  await kv.put(key, JSON.stringify(data));
}

export function getDownloadCoverUrl(file: DownloadFile) {
  if (file.cover_url) {
    return file.cover_url;
  }

  if (file.bvid) {
    return `https://i2.hdslb.com/bfs/archive/${file.bvid}.jpg`;
  }

  return "";
}

function normalizeDownloadFile(
  file: Partial<DownloadFile>,
  index: number
): DownloadFile {
  const id = String(file.id ?? index + 1);
  const title = String(file.title ?? file.name ?? "未命名资源");
  const downloadUrl = String(file.download_url ?? file.url ?? "#");
  const fileSize = String(file.file_size ?? file.size ?? "未知大小");
  const createdAt = String(file.created_at ?? new Date(0).toISOString());

  return {
    id,
    title,
    description: String(file.description ?? ""),
    download_url: downloadUrl,
    video_url: file.video_url ? String(file.video_url) : "",
    bvid: file.bvid ? String(file.bvid) : "",
    cover_url: file.cover_url ? String(file.cover_url) : "",
    created_at: createdAt,
    file_size: fileSize,
    name: String(file.name ?? title),
    type: String(file.type ?? ""),
    size: String(file.size ?? fileSize),
    url: String(file.url ?? downloadUrl)
  };
}
