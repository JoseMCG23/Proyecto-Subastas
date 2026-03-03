
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-violet-500/10 md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-500/20 via-transparent to-transparent" />
        <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">
              SUBASTA EN VIVO
            </span>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
              Colecciona lo{" "}
              <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                exclusivo
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
              El marketplace premium donde coleccionistas compiten por las piezas más codiciadas.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/subastas"
                className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
              >
                Pujar ahora →
              </Link>
              <Link
                to="/subastas"
                className="rounded-full bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10"
              >
                Explorar catálogo
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-white/5 to-transparent" />
            <div className="absolute inset-0 grid place-items-center text-white/40">
              {}
              <span className="text-sm">Hero Image</span>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <Card title="Finalizan hoy" subtitle="Subastas con cierre cercano" />
        <Card title="Más pujas" subtitle="Las más competitivas" />
        <Card title="Nuevas subastas" subtitle="Recién publicadas" />
      </section>
    </div>
  );
}

function Card({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-white/60">{subtitle}</p>
      <div className="mt-6 h-28 rounded-xl border border-white/10 bg-white/5" />
    </div>
  );
}

