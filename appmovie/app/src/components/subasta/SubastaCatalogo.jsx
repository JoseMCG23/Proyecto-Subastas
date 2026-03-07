import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SubastaService from "@/services/SubastaService";

const API_UPLOADS = "http://localhost:81/appmovie/api/uploads";

const CATS = ["Todas", "Marvel", "DC", "Disney", "Anime", "Star Wars", "Exclusivo"];

export function SubastaCatalogo() {
    const [subastas, setSubastas] = useState([]);
    const [activeCat, setActiveCat] = useState("Todas");
    const [searchParams] = useSearchParams();

    const q = (searchParams.get("q") || "").toLowerCase();

    useEffect(() => {
        SubastaService.getSubastas()
            .then((res) => setSubastas(res.data.data || []))
            .catch(console.error);
    }, []);

    const filtered = useMemo(() => {
        return subastas.filter((s) => {
            const nombre = (s.objeto || s.nombre || "").toLowerCase();
            const categorias = (s.categorias || "").toLowerCase();

            const matchSearch =
                !q || nombre.includes(q) || categorias.includes(q);

            const matchCat =
                activeCat === "Todas" ||
                categorias.includes(activeCat.toLowerCase());

            return matchSearch && matchCat;
        });
    }, [subastas, q, activeCat]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold">Catálogo de subastas</h1>
                <p className="text-sm text-white/60">
                    {filtered.length} subastas disponibles
                </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {CATS.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCat(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold ring-1 ring-white/10 transition
                        ${activeCat === cat
                                ? "bg-violet-500/20 text-violet-200"
                                : "bg-white/5 text-white/70 hover:bg-white/10"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((s) => {
                    const imgName =
                        s.imagen || s.imagen_portada || s.imagenPortada || "";

                    const imgSrc = imgName
                        ? `${API_UPLOADS}/${imgName}`
                        : "";

                    return (
                        <Link
                            key={s.idsubasta}
                            to={`/subastas/${s.idsubasta}`}
                            className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-violet-400/30 transition"
                        >
                            <div className="aspect-[4/3] bg-black/20 grid place-items-center">
                                {imgSrc ? (
                                    <img
                                        src={imgSrc}
                                        alt={s.objeto || s.nombre}
                                        className="h-full w-full object-contain p-6 group-hover:scale-[1.02] transition"
                                    />
                                ) : (
                                    <p className="text-white/60 text-sm">
                                        Imagen no disponible
                                    </p>
                                )}
                            </div>

                            <div className="p-5">
                                <p className="font-semibold line-clamp-1">
                                    {s.objeto || s.nombre}
                                </p>

                                <div className="mt-4">
                                    <p className="text-xs text-white/50">Precio base</p>
                                    <p className="text-lg font-extrabold text-emerald-300">
                                        ₡{Number(s.precioBase || 0).toLocaleString("es-CR")}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}