# Blender FX Lab

A minimal Next.js MVP for sharing Blender FX tutorials and downloadable project files, with a password-protected admin panel.

## Stack

- Next.js App Router
- TypeScript
- TailwindCSS
- JSON files as the data source and storage
- Cloudflare R2 direct URLs for downloads

## Admin

Create `.env.local` and set:

```bash
ADMIN_PASSWORD=your-password
```

Then open `/admin`.

The admin panel can:

- Add tutorials to `data/tutorials.json`
- Add downloadable files to `data/files.json`
- Store Cloudflare R2 direct URLs only

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Update Content

- Tutorials: `data/tutorials.json`
- Download files: `data/files.json`
- Thumbnails: `public/images`

Replace the sample `https://r2.example.com/...` values with your Cloudflare R2 public file URLs.

## Deploy

Import the repository into Vercel and deploy with the default Next.js settings. Add `ADMIN_PASSWORD` in Vercel Project Settings.

Important: Vercel serverless deployments do not persist runtime writes to repository JSON files. This JSON-write admin flow is suitable for local MVP use or a persistent Node hosting environment. For production on Vercel, use a persistent storage layer such as Vercel Blob, R2 object writes, KV, or a database.
