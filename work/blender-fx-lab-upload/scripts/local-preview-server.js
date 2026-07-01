const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

const root = process.cwd();
const dataDir = path.join(root, "data");
const publicDir = path.join(root, "public");
const password = process.env.ADMIN_PASSWORD || "123456";
const port = Number(process.env.PORT || 3000);

function readJson(fileName) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dataDir, fileName), "utf8"));
  } catch {
    return [];
  }
}

function writeJson(fileName, value) {
  fs.writeFileSync(
    path.join(dataDir, fileName),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8"
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function page(title, body) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    *{box-sizing:border-box}body{margin:0;background:#080b12;color:#e2e8f0;font-family:Arial,"Microsoft YaHei",sans-serif}a{color:inherit;text-decoration:none}.nav{position:sticky;top:0;border-bottom:1px solid #263244;background:#080b12ee;backdrop-filter:blur(12px);z-index:2}.wrap{width:min(1120px,calc(100% - 32px));margin:0 auto}.nav-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0}.logo{font-size:20px;font-weight:800;color:white}.links{display:flex;flex-wrap:wrap;gap:8px;font-size:14px;color:#cbd5e1}.links a{padding:8px 10px;border-radius:6px}.links a:hover{background:#ffffff14;color:white}.hero{border-bottom:1px solid #263244;padding:64px 0}.hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center}.kicker{color:#38bdf8;font-size:14px;font-weight:700;text-transform:uppercase}h1{margin:16px 0;color:white;font-size:clamp(36px,6vw,56px);line-height:1.1}h2{margin:0 0 10px;color:white;font-size:28px}h3{margin:0 0 10px;color:white}.subtitle{max-width:680px;color:#cbd5e1;font-size:18px;line-height:1.75}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}.btn,button{display:inline-flex;min-height:44px;align-items:center;justify-content:center;border:0;border-radius:6px;padding:10px 20px;background:#2563eb;color:white;font-size:14px;font-weight:700;cursor:pointer}.danger{background:#dc2626}.secondary{border:1px solid #263244;background:#ffffff0d}.visual,.card,.file,.panel{border:1px solid #263244;border-radius:8px;background:#111827;overflow:hidden}.visual img,.thumb img{display:block;width:100%;height:100%;object-fit:cover}.visual{min-height:320px}.section{padding:56px 0}.muted{margin:0 0 28px;color:#94a3b8;line-height:1.7}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.thumb{aspect-ratio:16/9;background:#172033}.card-body{padding:20px}.card p{min-height:52px;margin:0 0 20px;color:#cbd5e1;line-height:1.6;font-size:14px}.files,.stack{display:grid;gap:16px}.file{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:20px}.pill{display:inline-block;margin-right:8px;padding:5px 10px;border-radius:6px;background:#ffffff0f;color:#94a3b8;font-size:13px}.panel{padding:24px}.forms{display:grid;grid-template-columns:1fr 1fr;gap:20px}label{display:block;margin:14px 0 6px;color:#e2e8f0;font-size:14px;font-weight:700}input,textarea{width:100%;border:1px solid #263244;border-radius:6px;background:#080b12;color:white;padding:11px;font-size:14px;outline:none}textarea{min-height:110px}.notice{margin:0 0 20px;border:1px solid #10b98166;background:#10b9811a;color:#bbf7d0;border-radius:6px;padding:12px}.error{margin:16px 0 0;border:1px solid #ef444466;background:#ef44441a;color:#fecaca;border-radius:6px;padding:12px}.row{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.row4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.actions-small{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}@media(max-width:820px){.nav-inner,.file{align-items:flex-start;flex-direction:column}.hero-grid,.grid,.forms,.row,.row4{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <header class="nav"><nav class="wrap nav-inner"><a class="logo" href="/">Blender FX Lab</a><div class="links"><a href="/">Home</a><a href="/tutorials">Tutorials</a><a href="/files">Files</a><a href="/about">About</a></div></nav></header>
  ${body}
</body>
</html>`;
}

function tutorialCards() {
  return readJson("tutorials.json")
    .map(
      (tutorial) => `<article class="card">
        <div class="thumb"><img src="${escapeHtml(tutorial.thumbnailUrl)}" alt="${escapeHtml(tutorial.title)}" /></div>
        <div class="card-body">
          <h3>${escapeHtml(tutorial.title)}</h3>
          <p>${escapeHtml(tutorial.desc)}</p>
          <a class="btn" href="/tutorials/${tutorial.id}">查看教程</a>
        </div>
      </article>`
    )
    .join("");
}

function home() {
  return page(
    "Blender FX Lab",
    `<main><div class="hero"><div class="wrap hero-grid"><div><div class="kicker">Blender FX Lab</div><h1>Blender 特效教程与工程文件</h1><p class="subtitle">分享雾效、火焰、流体、软体等Blender特效教程，并提供工程文件下载</p><div class="actions"><a class="btn" href="/tutorials">观看教程</a><a class="btn secondary" href="/files">下载文件</a></div></div><div class="visual"><img src="/images/fluid.svg" alt="Blender fluid effect preview" /></div></div></div><section class="section"><div class="wrap"><h2>最新教程</h2><p class="muted">从 JSON 数据读取的最新 3 个 Blender 特效教程</p><div class="grid">${tutorialCards()}</div></div></section></main>`
  );
}

function tutorials() {
  return page(
    "Tutorials",
    `<main class="section"><div class="wrap"><h2>Tutorials</h2><p class="muted">浏览所有 Blender 特效教程。</p><div class="grid">${tutorialCards()}</div></div></main>`
  );
}

function tutorialDetail(id) {
  const tutorial = readJson("tutorials.json").find((item) => String(item.id) === id);

  if (!tutorial) {
    return page("Not Found", `<main class="section"><div class="wrap"><h2>没有找到这个教程</h2></div></main>`);
  }

  return page(
    tutorial.title,
    `<main class="section"><div class="wrap"><div class="panel"><div style="aspect-ratio:16/9;background:#000;margin:-24px -24px 24px"><iframe src="${escapeHtml(tutorial.videoUrl)}" title="${escapeHtml(tutorial.title)}" style="width:100%;height:100%;border:0" allowfullscreen></iframe></div><h2>${escapeHtml(tutorial.title)}</h2><p class="muted">${escapeHtml(tutorial.desc)}</p><a class="btn" href="${escapeHtml(tutorial.r2FileUrl)}" target="_blank" rel="noreferrer">下载工程文件</a></div></div></main>`
  );
}

function filesPage() {
  const files = readJson("files.json")
    .map(
      (file) => `<article class="file"><div><h3>${escapeHtml(file.name)}</h3><span class="pill">${escapeHtml(file.size)}</span><span class="pill">${escapeHtml(file.type)}</span></div><a class="btn" href="${escapeHtml(file.url)}" target="_blank" rel="noreferrer">下载</a></article>`
    )
    .join("");

  return page("Files", `<main class="section"><div class="wrap"><h2>Files</h2><p class="muted">所有下载链接都指向 Cloudflare R2 direct URL。</p><div class="files">${files}</div></div></main>`);
}

function about() {
  return page("About", `<main class="section"><div class="wrap"><div class="panel"><h2>About</h2><p class="muted">This site provides Blender simulation tutorials and project files.</p></div></div></main>`);
}

function input(name, value, placeholder) {
  return `<input name="${name}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" required />`;
}

function tutorialManager() {
  return readJson("tutorials.json")
    .map(
      (tutorial) => `<article class="panel">
        <form method="post" action="/admin/tutorials/update">
          <input type="hidden" name="id" value="${tutorial.id}" />
          <div class="row">
            <div><label>标题</label>${input("title", tutorial.title, "教程标题")}</div>
            <div><label>视频链接</label>${input("videoUrl", tutorial.videoUrl, "视频链接")}</div>
          </div>
          <label>描述</label><textarea name="desc" required>${escapeHtml(tutorial.desc)}</textarea>
          <div class="row">
            <div><label>缩略图链接</label>${input("thumbnailUrl", tutorial.thumbnailUrl, "缩略图链接")}</div>
            <div><label>R2 文件下载链接</label>${input("r2FileUrl", tutorial.r2FileUrl, "R2 文件链接")}</div>
          </div>
          <div class="actions-small"><button type="submit">保存修改</button></div>
        </form>
        <form method="post" action="/admin/tutorials/delete" class="actions-small">
          <input type="hidden" name="id" value="${tutorial.id}" />
          <button class="danger" type="submit">删除教程</button>
        </form>
      </article>`
    )
    .join("");
}

function fileManager() {
  return readJson("files.json")
    .map(
      (file, index) => `<article class="panel">
        <form method="post" action="/admin/files/update">
          <input type="hidden" name="index" value="${index}" />
          <div class="row4">
            <div><label>文件名</label>${input("name", file.name, "文件名")}</div>
            <div><label>文件类型</label>${input("type", file.type, ".blend / .zip")}</div>
            <div><label>文件大小</label>${input("size", file.size, "120MB")}</div>
            <div><label>R2 下载链接</label>${input("url", file.url, "R2 下载链接")}</div>
          </div>
          <div class="actions-small"><button type="submit">保存修改</button></div>
        </form>
        <form method="post" action="/admin/files/delete" class="actions-small">
          <input type="hidden" name="index" value="${index}" />
          <button class="danger" type="submit">删除文件</button>
        </form>
      </article>`
    )
    .join("");
}

function admin(req, message = "") {
  const loggedIn = (req.headers.cookie || "").includes("admin=1");

  if (!loggedIn) {
    const url = new URL(req.url, `http://localhost:${port}`);
    const error = url.searchParams.get("error")
      ? `<p class="error">密码不对。测试密码是：123456</p>`
      : "";

    return page(
      "Admin Login",
      `<main class="section"><div class="wrap" style="max-width:460px"><div class="panel"><h2>管理后台登录</h2><p class="muted">输入管理员密码后才能管理教程和下载文件。</p>${error}<form method="post" action="/admin/login"><label>密码</label><input type="password" name="password" required /><div style="margin-top:18px"><button type="submit">登录</button></div></form></div></div></main>`
    );
  }

  const tutorials = readJson("tutorials.json");
  const files = readJson("files.json");

  return page(
    "Admin Dashboard",
    `<main class="section"><div class="wrap"><h2>管理后台</h2><p class="muted">这里有三大功能：添加、编辑、删除。文件本身放在 Cloudflare R2，这里只填写链接。</p>${message}<div class="forms"><form class="panel" method="post" action="/admin/tutorials"><h3>添加教程</h3><p class="muted">当前共有 ${tutorials.length} 个教程</p><label>标题</label><input name="title" placeholder="Blender 雾效教程" required /><label>描述</label><textarea name="desc" placeholder="体积雾基础制作" required></textarea><label>视频链接</label><input name="videoUrl" placeholder="https://www.youtube.com/embed/..." required /><label>缩略图链接</label><input name="thumbnailUrl" placeholder="/images/fog.svg 或 https://..." required /><label>R2 文件下载链接</label><input name="r2FileUrl" placeholder="https://r2.example.com/fog.blend" required /><div style="margin-top:18px"><button type="submit">添加教程</button></div></form><form class="panel" method="post" action="/admin/files"><h3>添加文件资源</h3><p class="muted">当前共有 ${files.length} 个文件资源</p><label>文件名</label><input name="name" placeholder="雾效工程文件" required /><label>文件类型</label><input name="type" placeholder=".blend / .zip" required /><label>文件大小</label><input name="size" placeholder="120MB" required /><label>R2 下载链接</label><input name="url" placeholder="https://r2.example.com/fog.blend" required /><div style="margin-top:18px"><button type="submit">添加文件</button></div></form></div><section class="section"><h2>管理已有教程</h2><p class="muted">修改字段后点“保存修改”，不需要改代码。</p><div class="stack">${tutorialManager()}</div></section><section><h2>管理已有文件</h2><p class="muted">可以编辑文件信息，也可以删除旧文件。</p><div class="stack">${fileManager()}</div></section></div></main>`
  );
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(querystring.parse(body)));
  });
}

function redirect(res, location, cookie) {
  const headers = { Location: location };
  if (cookie) {
    headers["Set-Cookie"] = cookie;
  }
  res.writeHead(302, headers);
  res.end();
}

function isAdmin(req) {
  return (req.headers.cookie || "").includes("admin=1");
}

function writeHtml(res, html) {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);

  if (url.pathname.startsWith("/images/")) {
    const filePath = path.join(publicDir, url.pathname);
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { "Content-Type": "image/svg+xml; charset=utf-8" });
      res.end(fs.readFileSync(filePath));
      return;
    }
  }

  if (req.method === "POST" && url.pathname === "/admin/login") {
    const body = await readBody(req);
    redirect(
      res,
      body.password === password ? "/admin" : "/admin?error=1",
      body.password === password ? "admin=1; Path=/; HttpOnly; SameSite=Lax" : undefined
    );
    return;
  }

  if (req.method === "POST" && url.pathname.startsWith("/admin/") && !isAdmin(req)) {
    redirect(res, "/admin");
    return;
  }

  if (req.method === "POST" && url.pathname === "/admin/tutorials") {
    const body = await readBody(req);
    const tutorials = readJson("tutorials.json");
    tutorials.unshift({
      id: tutorials.length ? Math.max(...tutorials.map((item) => item.id)) + 1 : 1,
      title: String(body.title || ""),
      desc: String(body.desc || ""),
      videoUrl: String(body.videoUrl || ""),
      thumbnailUrl: String(body.thumbnailUrl || ""),
      r2FileUrl: String(body.r2FileUrl || "")
    });
    writeJson("tutorials.json", tutorials);
    writeHtml(res, admin(req, `<p class="notice">教程已添加。</p>`));
    return;
  }

  if (req.method === "POST" && url.pathname === "/admin/tutorials/update") {
    const body = await readBody(req);
    const id = Number(body.id);
    const tutorials = readJson("tutorials.json").map((tutorial) =>
      tutorial.id === id
        ? {
            id,
            title: String(body.title || ""),
            desc: String(body.desc || ""),
            videoUrl: String(body.videoUrl || ""),
            thumbnailUrl: String(body.thumbnailUrl || ""),
            r2FileUrl: String(body.r2FileUrl || "")
          }
        : tutorial
    );
    writeJson("tutorials.json", tutorials);
    writeHtml(res, admin(req, `<p class="notice">教程已保存修改。</p>`));
    return;
  }

  if (req.method === "POST" && url.pathname === "/admin/tutorials/delete") {
    const body = await readBody(req);
    const id = Number(body.id);
    writeJson(
      "tutorials.json",
      readJson("tutorials.json").filter((tutorial) => tutorial.id !== id)
    );
    writeHtml(res, admin(req, `<p class="notice">教程已删除。</p>`));
    return;
  }

  if (req.method === "POST" && url.pathname === "/admin/files") {
    const body = await readBody(req);
    const files = readJson("files.json");
    files.unshift({
      name: String(body.name || ""),
      type: String(body.type || ""),
      size: String(body.size || ""),
      url: String(body.url || "")
    });
    writeJson("files.json", files);
    writeHtml(res, admin(req, `<p class="notice">文件资源已添加。</p>`));
    return;
  }

  if (req.method === "POST" && url.pathname === "/admin/files/update") {
    const body = await readBody(req);
    const index = Number(body.index);
    const files = readJson("files.json");
    if (index >= 0 && index < files.length) {
      files[index] = {
        name: String(body.name || ""),
        type: String(body.type || ""),
        size: String(body.size || ""),
        url: String(body.url || "")
      };
      writeJson("files.json", files);
    }
    writeHtml(res, admin(req, `<p class="notice">文件已保存修改。</p>`));
    return;
  }

  if (req.method === "POST" && url.pathname === "/admin/files/delete") {
    const body = await readBody(req);
    const index = Number(body.index);
    const files = readJson("files.json");
    if (index >= 0 && index < files.length) {
      files.splice(index, 1);
      writeJson("files.json", files);
    }
    writeHtml(res, admin(req, `<p class="notice">文件已删除。</p>`));
    return;
  }

  let html;
  if (url.pathname === "/") html = home();
  else if (url.pathname === "/tutorials") html = tutorials();
  else if (url.pathname.startsWith("/tutorials/")) html = tutorialDetail(url.pathname.split("/").pop());
  else if (url.pathname === "/files") html = filesPage();
  else if (url.pathname === "/about") html = about();
  else if (url.pathname === "/admin") html = admin(req);
  else html = page("Not Found", `<main class="section"><div class="wrap"><h2>页面不存在</h2></div></main>`);

  writeHtml(res, html);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Blender FX Lab preview: http://127.0.0.1:${port}`);
  console.log(`Admin: http://127.0.0.1:${port}/admin`);
  console.log("Admin password: 123456");
});
