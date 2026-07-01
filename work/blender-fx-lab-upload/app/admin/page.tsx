import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { ADMIN_COOKIE, isValidAdminSession } from "@/lib/admin";
import { getFiles, getTutorials } from "@/lib/data";
import {
  addFileAction,
  addTutorialAction,
  deleteFileAction,
  deleteTutorialAction,
  loginAction,
  logoutAction,
  updateFileAction,
  updateTutorialAction
} from "./actions";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

function Field({
  defaultValue,
  label,
  name,
  placeholder,
  textarea = false
}: {
  defaultValue?: string;
  label: string;
  name: string;
  placeholder: string;
  textarea?: boolean;
}) {
  const className =
    "mt-2 w-full rounded-md border border-lab-line bg-lab-bg px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lab-blue";

  return (
    <label className="block text-sm font-medium text-slate-200">
      {label}
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={4}
          required
          defaultValue={defaultValue}
          className={className}
        />
      ) : (
        <input
          name={name}
          placeholder={placeholder}
          required
          defaultValue={defaultValue}
          className={className}
        />
      )}
    </label>
  );
}

function SubmitButton({
  children,
  variant = "primary"
}: {
  children: ReactNode;
  variant?: "primary" | "danger" | "secondary";
}) {
  const classes = {
    primary: "bg-lab-blue2 text-white hover:bg-blue-500",
    danger: "bg-red-600 text-white hover:bg-red-500",
    secondary: "border border-lab-line bg-white/5 text-slate-100 hover:bg-white/10"
  };

  return (
    <button
      type="submit"
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition ${classes[variant]}`}
    >
      {children}
    </button>
  );
}

async function LoginForm({ hasError }: { hasError: boolean }) {
  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-lab-line bg-lab-panel p-6">
        <h1 className="text-2xl font-bold text-white">管理后台登录</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          输入管理员密码后，才能添加、编辑和删除教程与文件。
        </p>
        {hasError ? (
          <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            密码错误，或还没有配置 ADMIN_PASSWORD。
          </p>
        ) : null}
        <form action={loginAction} className="mt-6 space-y-5">
          <label className="block text-sm font-medium text-slate-200">
            密码
            <input
              type="password"
              name="password"
              required
              className="mt-2 w-full rounded-md border border-lab-line bg-lab-bg px-3 py-2.5 text-sm text-white outline-none transition focus:border-lab-blue"
            />
          </label>
          <SubmitButton>登录</SubmitButton>
        </form>
      </div>
    </section>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const isLoggedIn = isValidAdminSession(
    cookieStore.get(ADMIN_COOKIE)?.value
  );

  if (!isLoggedIn) {
    return <LoginForm hasError={params.error === "1"} />;
  }

  const tutorials = getTutorials();
  const files = getFiles();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">管理后台</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            在这里添加、编辑、删除教程和下载文件。Blender 文件放在 Cloudflare R2，这里只保存链接。
          </p>
        </div>
        <form action={logoutAction}>
          <SubmitButton variant="secondary">退出登录</SubmitButton>
        </form>
      </div>

      {params.success ? (
        <p className="mb-6 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          操作已保存。
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          action={addTutorialAction}
          className="space-y-5 rounded-lg border border-lab-line bg-lab-panel p-5"
        >
          <div>
            <h2 className="text-xl font-bold text-white">添加教程</h2>
            <p className="mt-1 text-sm text-slate-400">
              当前共有 {tutorials.length} 个教程
            </p>
          </div>
          <Field label="标题" name="title" placeholder="Blender 雾效教程" />
          <Field
            label="描述"
            name="desc"
            placeholder="体积雾基础制作"
            textarea
          />
          <Field
            label="视频链接"
            name="videoUrl"
            placeholder="https://www.youtube.com/embed/..."
          />
          <Field
            label="缩略图链接"
            name="thumbnailUrl"
            placeholder="/images/fog.svg 或 https://..."
          />
          <Field
            label="R2 文件下载链接"
            name="r2FileUrl"
            placeholder="https://r2.example.com/fog.blend"
          />
          <SubmitButton>添加教程</SubmitButton>
        </form>

        <form
          action={addFileAction}
          className="space-y-5 rounded-lg border border-lab-line bg-lab-panel p-5"
        >
          <div>
            <h2 className="text-xl font-bold text-white">添加文件资源</h2>
            <p className="mt-1 text-sm text-slate-400">
              当前共有 {files.length} 个文件资源
            </p>
          </div>
          <Field label="文件名" name="name" placeholder="雾效工程文件" />
          <Field label="文件类型" name="type" placeholder=".blend / .zip" />
          <Field label="文件大小" name="size" placeholder="120MB" />
          <Field
            label="R2 下载链接"
            name="url"
            placeholder="https://r2.example.com/fog.blend"
          />
          <SubmitButton>添加文件</SubmitButton>
        </form>
      </div>

      <div className="mt-10 space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white">管理已有教程</h2>
          <p className="mt-2 text-sm text-slate-400">
            修改字段后点击“保存修改”。点击“删除教程”会直接移除这一条。
          </p>
        </div>
        {tutorials.map((tutorial) => (
          <article
            key={tutorial.id}
            className="rounded-lg border border-lab-line bg-lab-panel p-5"
          >
            <form action={updateTutorialAction} className="space-y-4">
              <input type="hidden" name="id" value={tutorial.id} />
              <div className="grid gap-4 lg:grid-cols-2">
                <Field
                  label="标题"
                  name="title"
                  placeholder="教程标题"
                  defaultValue={tutorial.title}
                />
                <Field
                  label="视频链接"
                  name="videoUrl"
                  placeholder="视频链接"
                  defaultValue={tutorial.videoUrl}
                />
              </div>
              <Field
                label="描述"
                name="desc"
                placeholder="教程描述"
                defaultValue={tutorial.desc}
                textarea
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <Field
                  label="缩略图链接"
                  name="thumbnailUrl"
                  placeholder="缩略图链接"
                  defaultValue={tutorial.thumbnailUrl}
                />
                <Field
                  label="R2 文件下载链接"
                  name="r2FileUrl"
                  placeholder="R2 文件链接"
                  defaultValue={tutorial.r2FileUrl}
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <SubmitButton>保存修改</SubmitButton>
              </div>
            </form>
            <form action={deleteTutorialAction} className="mt-3">
              <input type="hidden" name="id" value={tutorial.id} />
              <SubmitButton variant="danger">删除教程</SubmitButton>
            </form>
          </article>
        ))}
      </div>

      <div className="mt-10 space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white">管理已有文件</h2>
          <p className="mt-2 text-sm text-slate-400">
            可以更新文件名、类型、大小和 R2 下载链接，也可以删除旧文件资源。
          </p>
        </div>
        {files.map((file, index) => (
          <article
            key={`${file.url}-${index}`}
            className="rounded-lg border border-lab-line bg-lab-panel p-5"
          >
            <form action={updateFileAction} className="space-y-4">
              <input type="hidden" name="index" value={index} />
              <div className="grid gap-4 lg:grid-cols-4">
                <Field
                  label="文件名"
                  name="name"
                  placeholder="文件名"
                  defaultValue={file.name}
                />
                <Field
                  label="文件类型"
                  name="type"
                  placeholder=".blend / .zip"
                  defaultValue={file.type}
                />
                <Field
                  label="文件大小"
                  name="size"
                  placeholder="120MB"
                  defaultValue={file.size}
                />
                <Field
                  label="R2 下载链接"
                  name="url"
                  placeholder="https://r2.example.com/file.blend"
                  defaultValue={file.url}
                />
              </div>
              <SubmitButton>保存修改</SubmitButton>
            </form>
            <form action={deleteFileAction} className="mt-3">
              <input type="hidden" name="index" value={index} />
              <SubmitButton variant="danger">删除文件</SubmitButton>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}
