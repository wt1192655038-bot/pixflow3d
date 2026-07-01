import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { ADMIN_COOKIE, isValidAdminSession } from "@/lib/admin";
import { getDownloadCoverUrl, getFiles, type DownloadFile } from "@/lib/data";
import {
  addDownloadResourceAction,
  deleteDownloadResourceAction,
  loginAction,
  logoutAction,
  updateDownloadResourceAction
} from "./actions";

export const dynamic = "force-dynamic";
export const runtime = "edge";

type AdminPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
    new?: string;
  }>;
};

function Field({
  defaultValue,
  label,
  name,
  placeholder,
  required = true,
  textarea = false
}: {
  defaultValue?: string;
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const className =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#10213f] outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100";

  return (
    <label className="block text-sm font-semibold text-[#273653]">
      {label}
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={4}
          required={required}
          defaultValue={defaultValue}
          className={className}
        />
      ) : (
        <input
          name={name}
          placeholder={placeholder}
          required={required}
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
    primary: "bg-[#0ea5c6] text-white hover:bg-[#0793b5]",
    danger: "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
    secondary: "border border-slate-200 bg-white text-[#33415f] hover:bg-slate-50"
  };

  return (
    <button
      type="submit"
      className={`inline-flex min-h-10 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition ${classes[variant]}`}
    >
      {children}
    </button>
  );
}

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

function coverUrlFor(file: DownloadFile) {
  return getDownloadCoverUrl(file);
}

async function LoginForm({ hasError }: { hasError: boolean }) {
  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-[0_18px_45px_rgba(26,52,96,0.12)]">
        <h1 className="text-2xl font-bold text-[#10213f]">管理后台登录</h1>
        <p className="mt-2 text-sm leading-6 text-[#657188]">
          输入管理员密码后，才能管理 Pixflow 下载资源。
        </p>
        {hasError ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            密码错误，或还没有配置 ADMIN_PASSWORD。
          </p>
        ) : null}
        <form action={loginAction} className="mt-6 space-y-5">
          <label className="block text-sm font-semibold text-[#273653]">
            密码
            <input
              type="password"
              name="password"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#10213f] outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </label>
          <SubmitButton>登录</SubmitButton>
        </form>
      </div>
    </section>
  );
}

function ResourceForm({
  action,
  resource,
  submitText
}: {
  action: (formData: FormData) => void | Promise<void>;
  resource?: DownloadFile;
  submitText: string;
}) {
  return (
    <form action={action} className="space-y-4">
      {resource ? <input type="hidden" name="id" value={resource.id} /> : null}
      <Field
        label="标题"
        name="title"
        placeholder="火焰效果"
        defaultValue={resource?.title}
      />
      <Field
        label="简介"
        name="description"
        placeholder="用于 Blender 火焰模拟练习的工程文件"
        defaultValue={resource?.description}
        textarea
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="文件大小"
          name="file_size"
          placeholder="128 MB"
          defaultValue={resource?.file_size}
        />
        <Field
          label="下载链接"
          name="download_url"
          placeholder="https://your-r2-url.com/file.zip"
          defaultValue={resource?.download_url}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="B站链接"
          name="video_url"
          placeholder="https://www.bilibili.com/video/..."
          required={false}
          defaultValue={resource?.video_url}
        />
        <Field
          label="B站封面 ID"
          name="bvid"
          placeholder="用于生成 i2.hdslb.com 封面"
          required={false}
          defaultValue={resource?.bvid}
        />
      </div>
      <Field
        label="R2 封面图链接"
        name="cover_url"
        placeholder="https://your-r2-url.com/covers/xxx.jpg"
        required={false}
        defaultValue={resource?.cover_url}
      />
      <SubmitButton>{submitText}</SubmitButton>
    </form>
  );
}

function ResourceCard({ resource }: { resource: DownloadFile }) {
  const coverUrl = coverUrlFor(resource);

  return (
    <article className="group">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 via-blue-50 to-violet-100">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={resource.title}
            className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-[#7b879c]">
            等待添加封面图
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#1f2d48]">
            {resource.title}
          </h2>
          <p className="mt-1 text-xs font-medium text-[#8a96aa]">
            {resource.file_size}
          </p>
        </div>
        <a
          href={resource.download_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#14b8d4] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#0e99be] transition hover:bg-cyan-50"
        >
          <DownloadIcon />
          下载
        </a>
      </div>
      <details className="mt-3 rounded-2xl border border-slate-200 bg-white/80 p-3">
        <summary className="cursor-pointer text-xs font-semibold text-[#0e99be]">
          编辑项目
        </summary>
        <div className="mt-4">
          <ResourceForm
            action={updateDownloadResourceAction}
            resource={resource}
            submitText="保存修改"
          />
          <form action={deleteDownloadResourceAction} className="mt-3">
            <input type="hidden" name="id" value={resource.id} />
            <SubmitButton variant="danger">删除项目</SubmitButton>
          </form>
        </div>
      </details>
    </article>
  );
}

function NewResourceCard() {
  return (
    <a
      href="/admin?new=1"
      className="flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/45 text-sm font-semibold text-slate-500 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#0e99be]"
    >
      + 新建项目
    </a>
  );
}

function NewResourceModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-[0_24px_70px_rgba(15,35,70,0.22)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#10213f]">新建下载项目</h2>
            <p className="mt-2 text-sm leading-6 text-[#657188]">
              方案 A 只保存 R2 图片链接。如果没有 R2 封面图，可以填写 B站封面 ID 自动兜底。
            </p>
          </div>
          <a
            href="/admin"
            className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-50"
          >
            关闭
          </a>
        </div>
        <ResourceForm action={addDownloadResourceAction} submitText="创建项目" />
      </div>
    </div>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const isLoggedIn = await isValidAdminSession(
    cookieStore.get(ADMIN_COOKIE)?.value
  );

  if (!isLoggedIn) {
    return <LoginForm hasError={params.error === "1"} />;
  }

  const files = await getFiles();

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#0e99be]">
            Pixflow 管理后台
          </p>
          <h1 className="mt-2 text-3xl font-black text-[#10213f]">
            下载资源管理
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#657188]">
            管理教程工程文件、R2 下载链接和封面图链接。当前共有 {files.length} 个下载项目。
          </p>
        </div>
        <form action={logoutAction}>
          <SubmitButton variant="secondary">退出登录</SubmitButton>
        </form>
      </div>

      {params.success ? (
        <p className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          操作已保存。
        </p>
      ) : null}

      <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
        {files.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
        <NewResourceCard />
      </div>

      {params.new === "1" ? <NewResourceModal /> : null}
    </section>
  );
}
