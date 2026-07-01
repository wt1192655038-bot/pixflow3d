export default function AboutPage() {
  return (
    <main className="bg-[#f6f9ff]">
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:py-20">
        <article className="overflow-hidden rounded-[32px] border border-white bg-white/90 shadow-[0_22px_70px_rgba(47,83,143,0.12)] backdrop-blur">
          <div className="bg-gradient-to-r from-[#e8fbff] via-white to-[#f0edff] px-6 py-8 sm:px-10 lg:px-14">
            <p className="text-sm font-semibold tracking-[0.18em] text-[#168ad8]">
              PIXFLOW ABOUT
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[#0c1f3d] sm:text-5xl">
              Pixflow｜像素流动
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5d6f8c]">
              一个专注 Blender 特效与物理模拟的视觉实验室。
            </p>
          </div>

          <div className="space-y-9 px-6 py-8 text-[#22324d] sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            <section className="space-y-4 text-base leading-8 sm:text-lg">
              <p>我们用 Blender 研究“视觉如何被创造”：</p>
              <p>火焰、烟雾、破碎、流体、粒子、大气光效。</p>
              <p>
                这里不是传统教程网站，
                <br />
                而是一个“可复现视觉效果的素材与方法库”。
              </p>
            </section>

            <Divider />

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#0c1f3d]">我在做什么？</h2>
              <p className="text-base leading-8 text-[#465a78] sm:text-lg">我专注于：</p>
              <ul className="grid gap-3 text-base leading-7 text-[#344863] sm:grid-cols-2 sm:text-lg">
                <li className="rounded-2xl bg-[#f4f9ff] px-4 py-3">Blender 特效制作</li>
                <li className="rounded-2xl bg-[#f4f9ff] px-4 py-3">解压类物理模拟动画</li>
                <li className="rounded-2xl bg-[#f4f9ff] px-4 py-3">高传播视觉内容结构设计</li>
                <li className="rounded-2xl bg-[#f4f9ff] px-4 py-3">可复用的工程文件制作</li>
              </ul>
              <p className="text-base leading-8 text-[#465a78] sm:text-lg">
                目标很简单：
                <br />
                让任何人都可以快速做出“看起来很高级”的视觉效果。
              </p>
            </section>

            <Divider />

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#0c1f3d]">这个网站是什么？</h2>
              <p className="text-base leading-8 text-[#465a78] sm:text-lg">
                Pixflow = Pixel + Flow
              </p>
              <p className="text-base leading-8 text-[#465a78] sm:text-lg">
                代表：
                <br />
                像素在流动，视觉在生成。
              </p>
              <div>
                <p className="text-base leading-8 text-[#465a78] sm:text-lg">
                  这里你可以找到：
                </p>
                <ul className="mt-3 space-y-2 text-base leading-7 text-[#344863] sm:text-lg">
                  <li>Blender效果教程</li>
                  <li>工程文件下载</li>
                  <li>视觉案例拆解</li>
                </ul>
              </div>
            </section>

            <Divider />

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#0c1f3d]">为什么做这个？</h2>
              <p className="text-base leading-8 text-[#465a78] sm:text-lg">因为我相信：</p>
              <blockquote className="rounded-3xl border border-[#cfefff] bg-gradient-to-r from-[#f4fcff] to-[#f5f2ff] px-5 py-5 text-lg font-bold leading-8 text-[#10213f] sm:text-xl">
                “好的视觉效果，应该是可以被复现的，而不是只能观看的。”
              </blockquote>
            </section>

            <Divider />

            <section>
              <p className="text-base font-semibold leading-8 text-[#168ad8] sm:text-lg">
                联系 / 反馈：1192655038@qq.com
              </p>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}

function Divider() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-[#bdefff] to-transparent" />;
}
