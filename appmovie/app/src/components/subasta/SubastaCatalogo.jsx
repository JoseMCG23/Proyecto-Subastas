import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SubastaService from "@/services/SubastaService";

const API_UPLOADS = "http://localhost:81/appmovie/api/uploads";

const CATS = ["Todas", "Marvel", "DC", "Disney", "Anime", "Star Wars", "Exclusivo"];
const ESTADOS = ["Todas", "ACTIVA", "INACTIVA", "FINALIZADA", "CANCELADA"];

export function SubastaCatalogo() {
    const [subastas, setSubastas] = useState([]);
    const [activeCat, setActiveCat] = useState("Todas");
    const [activeEstado, setActiveEstado] = useState("Todas");
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
            const estado = (s.estado || "").toUpperCase();

            const matchSearch =
                !q || nombre.includes(q) || categorias.includes(q);

            const matchCat =
                activeCat === "Todas" ||
                categorias.includes(activeCat.toLowerCase());

            const matchEstado =
                activeEstado === "Todas" ||
                estado === activeEstado;

            return matchSearch && matchCat && matchEstado;
        });
    }, [subastas, q, activeCat, activeEstado]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold">Catálogo de subastas</h1>
                <p className="text-sm text-white/60">
                    {filtered.length} subastas disponibles
                </p>
            </div>

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

            <div className="flex flex-wrap gap-2">
                {ESTADOS.map((estado) => (
                    <button
                        key={estado}
                        onClick={() => setActiveEstado(estado)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold ring-1 ring-white/10 transition
                        ${activeEstado === estado
                                ? "bg-emerald-500/20 text-emerald-200"
                                : "bg-white/5 text-white/70 hover:bg-white/10"
                            }`}
                    >
                        {estado}
                    </button>
                ))}
            </div>

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
                            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-violet-500/5 transition hover:-translate-y-0.5 hover:border-violet-400/30 relative"
                        >
                            <div className="relative aspect-square w-full overflow-hidden bg-black/30">
                                {imgSrc ? (
                                    <img
                                        src={imgSrc}
                                        alt={s.objeto || s.nombre}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                    />
                                ) : (
                                    <div className="grid h-full w-full place-items-center text-sm text-white/40">
                                        Sin imagen
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <p className="font-semibold line-clamp-1">
                                    {s.objeto || s.nombre}
                                </p>

                                <div className="mt-4 flex-1 flex flex-col justify-between min-h-35">
                                    <div>
                                        <p className="text-xs text-white/50">Precio base</p>
                                        <p className="text-lg font-extrabold text-emerald-300">
                                            ₡{Number(s.precioBase || 0).toLocaleString("es-CR")}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {(s.estado === "FINALIZADA" || s.estado === "CANCELADA") ? (
                                            <>
                                                <div className="col-span-2 w-full bg-violet-500/10 border border-violet-500/20 rounded px-2 py-1">
                                                    <p className="text-white/50 text-[10px] text-center">Fecha cierre</p>
                                                    <p className="font-bold text-violet-300 text-center">
                                                        {s.fechafin ? new Date(s.fechafin).toLocaleDateString("es-ES") : "—"}
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="bg-violet-500/10 border border-violet-500/20 rounded px-2 py-1">
                                                    <p className="text-white/50 text-[10px]">Pujas</p>
                                                    <p className="font-bold text-violet-300">
                                                        {s.cantidadPujas || 0}
                                                    </p>
                                                </div>

                                                <div className="bg-blue-500/10 border border-blue-500/20 rounded px-2 py-1">
                                                    <p className="text-white/50 text-[10px]">Incremento mínimo</p>
                                                    <p className="font-bold text-blue-300">
                                                        ₡{Number(s.incre_minimo || 0).toLocaleString("es-CR")}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}