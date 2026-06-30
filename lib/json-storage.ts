import {
  getFiles,
  getTutorials,
  writeCollection,
  type DownloadFile,
  type Tutorial
} from "@/lib/data";

export async function appendTutorial(input: Omit<Tutorial, "id">) {
  const tutorials = await getTutorials();
  const nextId =
    tutorials.length > 0
      ? Math.max(...tutorials.map((tutorial) => tutorial.id)) + 1
      : 1;

  tutorials.unshift({
    id: nextId,
    ...input
  });

  await writeCollection("tutorials", tutorials);
}

export async function appendFileResource(input: DownloadFile) {
  const files = await getFiles();
  files.unshift(input);
  await writeCollection("files", files);
}

export async function updateTutorial(id: number, input: Omit<Tutorial, "id">) {
  const tutorials = await getTutorials();
  const updatedTutorials = tutorials.map((tutorial) =>
    tutorial.id === id ? { id, ...input } : tutorial
  );

  await writeCollection("tutorials", updatedTutorials);
}

export async function deleteTutorial(id: number) {
  const tutorials = await getTutorials();
  await writeCollection(
    "tutorials",
    tutorials.filter((tutorial) => tutorial.id !== id)
  );
}

export async function updateFileResource(index: number, input: DownloadFile) {
  const files = await getFiles();

  if (index < 0 || index >= files.length) {
    return;
  }

  files[index] = input;
  await writeCollection("files", files);
}

export async function deleteFileResource(index: number) {
  const files = await getFiles();

  if (index < 0 || index >= files.length) {
    return;
  }

  files.splice(index, 1);
  await writeCollection("files", files);
}
