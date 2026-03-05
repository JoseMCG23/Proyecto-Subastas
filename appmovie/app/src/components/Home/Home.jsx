import { Link } from "react-router-dom";

const HERO_IMG = `${import.meta.env.VITE_BASE_URL.replace(/\/$/, "")}/uploads/Portada.jpg`;

export function Home() {
  return (
    <div className="pb-10 space-y-10">
      {/* HERO  */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-2xl shadow-violet-500/10">
        {/*  portada */}
        <img
          src={HERO_IMG}
          alt="Portada"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
        />

        {}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-500/35 via-transparent to-transparent" />

        {}
        <div className="relative px-8 py-14 md:px-12 md:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-violet-400/25 bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-200">
              SUBASTAS FUNKO POP
            </span>

            <h1 className="mt-5 leading-[0.95] font-extrabold tracking-tight">

              <span className="block text-4xl md:text-6xl text-white">
                Colecciona lo
              </span>

              <span className="block mt-3 text-5xl md:text-7xl bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                exclusivo
              </span>

            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
              El marketplace donde coleccionistas compiten por las piezas
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
               más codiciadas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:opacity-95 transition"
              >
                Pujar ahora →
              </Link>

              <Link
                to="/catalogo"
                className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white/90 ring-1 ring-white/15 hover:bg-white/15 transition"
              >
                Explorar catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card title="Finalizan hoy" subtitle="Subastas con cierre cercano" />
        <Card title="Más pujas" subtitle="Las más competitivas" />
        <Card title="Nuevas subastas" subtitle="Recién publicadas" />
      </section>
    </div>
  );
}

function Card({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.07] transition">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-white/60">{subtitle}</p>
      <div className="mt-6 h-28 rounded-xl border border-white/10 bg-black/20" />
    </div>
  );
}