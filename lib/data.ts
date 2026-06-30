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
  return readCollection<DownloadFile[]>("files", filesSeed);
}

export async function writeCollection<T>(key: string, data: T) {
  const kv = await getContentKV();

  if (!kv) {
    throw new Error("CONTENT_KV binding is required for admin writes.");
  }

  await kv.put(key, JSON.stringify(data));
}
