"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  getAdminSessionValue,
  isValidAdminSession
} from "@/lib/admin";
import {
  appendDownloadResource,
  appendTutorial,
  deleteDownloadResource,
  deleteTutorial,
  updateDownloadResource,
  updateTutorial
} from "@/lib/json-storage";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!(await isValidAdminSession(session))) {
    redirect("/admin");
  }
}

function requiredString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
}

function requiredNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key));

  if (!Number.isFinite(value)) {
    throw new Error(`${key} must be a number`);
  }

  return value;
}

function optionalString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function selectedTags(formData: FormData) {
  return formData
    .getAll("tags")
    .map((tag) => String(tag).trim())
    .filter(Boolean);
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword || password !== expectedPassword) {
    redirect("/admin?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, await getAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function addTutorialAction(formData: FormData) {
  await requireAdmin();

  await appendTutorial({
    title: requiredString(formData, "title"),
    desc: requiredString(formData, "desc"),
    videoUrl: requiredString(formData, "videoUrl"),
    thumbnailUrl: requiredString(formData, "thumbnailUrl"),
    r2FileUrl: requiredString(formData, "r2FileUrl")
  });

  revalidatePath("/");
  revalidatePath("/tutorials");
  revalidatePath("/admin");
  redirect("/admin?success=tutorial");
}

export async function addFileAction(formData: FormData) {
  await requireAdmin();

  await appendDownloadResource({
    title: requiredString(formData, "title"),
    description: requiredString(formData, "description"),
    download_url: requiredString(formData, "download_url"),
    file_size: requiredString(formData, "file_size"),
    video_url: optionalString(formData, "video_url"),
    bvid: optionalString(formData, "bvid"),
    cover_url: optionalString(formData, "cover_url"),
    tags: selectedTags(formData)
  });

  revalidatePath("/");
  revalidatePath("/files");
  revalidatePath("/admin");
  redirect("/admin?success=file");
}

export async function addDownloadResourceAction(formData: FormData) {
  await addFileAction(formData);
}

export async function updateTutorialAction(formData: FormData) {
  await requireAdmin();

  const id = requiredNumber(formData, "id");

  await updateTutorial(id, {
    title: requiredString(formData, "title"),
    desc: requiredString(formData, "desc"),
    videoUrl: requiredString(formData, "videoUrl"),
    thumbnailUrl: requiredString(formData, "thumbnailUrl"),
    r2FileUrl: requiredString(formData, "r2FileUrl")
  });

  revalidatePath("/");
  revalidatePath("/tutorials");
  revalidatePath(`/tutorials/${id}`);
  revalidatePath("/admin");
  redirect("/admin?success=updated-tutorial");
}

export async function deleteTutorialAction(formData: FormData) {
  await requireAdmin();

  const id = requiredNumber(formData, "id");
  await deleteTutorial(id);

  revalidatePath("/");
  revalidatePath("/tutorials");
  revalidatePath("/admin");
  redirect("/admin?success=deleted-tutorial");
}

export async function updateFileAction(formData: FormData) {
  await requireAdmin();

  await updateDownloadResource(requiredString(formData, "id"), {
    title: requiredString(formData, "title"),
    description: requiredString(formData, "description"),
    download_url: requiredString(formData, "download_url"),
    file_size: requiredString(formData, "file_size"),
    video_url: optionalString(formData, "video_url"),
    bvid: optionalString(formData, "bvid"),
    cover_url: optionalString(formData, "cover_url"),
    tags: selectedTags(formData)
  });

  revalidatePath("/");
  revalidatePath("/files");
  revalidatePath("/admin");
  redirect("/admin?success=updated-file");
}

export async function updateDownloadResourceAction(formData: FormData) {
  await updateFileAction(formData);
}

export async function deleteFileAction(formData: FormData) {
  await requireAdmin();

  await deleteDownloadResource(requiredString(formData, "id"));

  revalidatePath("/");
  revalidatePath("/files");
  revalidatePath("/admin");
  redirect("/admin?success=deleted-file");
}

export async function deleteDownloadResourceAction(formData: FormData) {
  await deleteFileAction(formData);
}
