import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { DownloadFile, Tutorial } from "@/lib/data";

const dataDir = path.join(process.cwd(), "data");

async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const filePath = path.join(dataDir, fileName);
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(fileName: string, data: T) {
  const filePath = path.join(dataDir, fileName);
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function appendTutorial(input: Omit<Tutorial, "id">) {
  const tutorials = await readJsonFile<Tutorial[]>("tutorials.json", []);
  const nextId =
    tutorials.length > 0
      ? Math.max(...tutorials.map((tutorial) => tutorial.id)) + 1
      : 1;

  tutorials.unshift({
    id: nextId,
    ...input
  });

  await writeJsonFile("tutorials.json", tutorials);
}

export async function appendFileResource(input: DownloadFile) {
  const files = await readJsonFile<DownloadFile[]>("files.json", []);
  files.unshift(input);
  await writeJsonFile("files.json", files);
}

export async function updateTutorial(id: number, input: Omit<Tutorial, "id">) {
  const tutorials = await readJsonFile<Tutorial[]>("tutorials.json", []);
  const updatedTutorials = tutorials.map((tutorial) =>
    tutorial.id === id ? { id, ...input } : tutorial
  );

  await writeJsonFile("tutorials.json", updatedTutorials);
}

export async function deleteTutorial(id: number) {
  const tutorials = await readJsonFile<Tutorial[]>("tutorials.json", []);
  await writeJsonFile(
    "tutorials.json",
    tutorials.filter((tutorial) => tutorial.id !== id)
  );
}

export async function updateFileResource(index: number, input: DownloadFile) {
  const files = await readJsonFile<DownloadFile[]>("files.json", []);

  if (index < 0 || index >= files.length) {
    return;
  }

  files[index] = input;
  await writeJsonFile("files.json", files);
}

export async function deleteFileResource(index: number) {
  const files = await readJsonFile<DownloadFile[]>("files.json", []);

  if (index < 0 || index >= files.length) {
    return;
  }

  files.splice(index, 1);
  await writeJsonFile("files.json", files);
}
