import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FunkoService from "@/services/FunkoService";

const imgUrl = (name) =>
    name ? `${import.meta.env.VITE_BASE_URL}uploads/${name}` : "";

const chipBase =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-white/10";

export default function FunkoList() {
    const [funkos, setFunkos] = useState([]);
    const [q, setQ] = useState("");

    useEffect(() => {
        FunkoService.getFunkos()
            .then((res) => setFunkos(Array.isArray(res.data) ? res.data : res.data?.data ?? []))
            .catch(() => setFunkos([]));
    }, []);

    const filtered = useMemo(() => {
        const text = q.trim().toLowerCase();
        if (!text) return funkos;
        return funkos.filter((f) => {
            const nombre = (f?.nombre ?? "").toLowerCase();
            const cat = (f?.categoria ?? f?.categorias ?? "").toString().toLowerCase();
            const dueno = (f?.dueno ?? f?.vendedor ?? f?.nombreVendedor ?? "").toString().toLowerCase();
            return nombre.includes(text) || cat.includes(text) || dueno.includes(text);
        });
    }, [funkos, q]);

    return (
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Catálogo de Funkos</h1>
                    <p className="mt-1 text-sm text-white/60">
                        {filtered.length} objetos disponibles
                    </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                    <div className="w-full sm:w-80">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Buscar por nombre, categoría o dueño…"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none ring-0 focus:border-violet-400/40"
                        />
                    </div>

                    <Link to="/funkos/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo Funko
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((f) => {
                    const id = f?.idFunko ?? f?.id ?? f?.id_funko;
                    const nombre = f?.nombre ?? "Sin nombre";
                    const categoria = f?.categoria ?? (Array.isArray(f?.categorias) ? f.categorias.join(", ") : f?.categorias);
                    const dueno = f?.dueno ?? f?.vendedor ?? f?.nombreVendedor;
                    const portada = f?.imagen_portada ?? f?.imagenPortada ?? f?.portada;

                    return (
                        <Link
                            key={id}
                            to={`/funkos/${id}`}
                            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-violet-500/5 transition hover:-translate-y-0.5 hover:border-violet-400/30"
                        >
                            <div className="relative aspect-square w-full overflow-hidden bg-black/30">
                                {portada ? (
                                    <img
                                        src={imgUrl(portada)}
                                        alt={nombre}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                        onError={(e) => (e.currentTarget.style.opacity = 0.2)}
                                    />
                                ) : (
                                    <div className="grid h-full w-full place-items-center text-sm text-white/40">
                                        Sin imagen
                                    </div>
                                )}

                                <div className="absolute left-3 top-3 flex gap-2">
                                    {categoria ? (
                                        <span className={`${chipBase} bg-violet-500/15 text-violet-200`}>
                                            {String(categoria)}
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="line-clamp-1 text-base font-semibold text-white">
                                    {nombre}
                                </h3>

                                <div className="mt-3 flex items-center justify-between text-sm text-white/60">
                                    <span className="line-clamp-1">
                                        Dueño: <span className="text-white/80">{dueno ?? "—"}</span>
                                    </span>
                                    <span className="text-violet-300 group-hover:text-violet-200">
                                        Ver detalle →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
                    No hay resultados con ese filtro.
                </div>
            )}
        </div>
    );
}