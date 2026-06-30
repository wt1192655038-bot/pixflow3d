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
  appendFileResource,
  appendTutorial,
  deleteFileResource,
  deleteTutorial,
  updateFileResource,
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

  await appendFileResource({
    name: requiredString(formData, "name"),
    type: requiredString(formData, "type"),
    size: requiredString(formData, "size"),
    url: requiredString(formData, "url")
  });

  revalidatePath("/files");
  revalidatePath("/admin");
  redirect("/admin?success=file");
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

  await updateFileResource(requiredNumber(formData, "index"), {
    name: requiredString(formData, "name"),
    type: requiredString(formData, "type"),
    size: requiredString(formData, "size"),
    url: requiredString(formData, "url")
  });

  revalidatePath("/files");
  revalidatePath("/admin");
  redirect("/admin?success=updated-file");
}

export async function deleteFileAction(formData: FormData) {
  await requireAdmin();

  await deleteFileResource(requiredNumber(formData, "index"));

  revalidatePath("/files");
  revalidatePath("/admin");
  redirect("/admin?success=deleted-file");
}
