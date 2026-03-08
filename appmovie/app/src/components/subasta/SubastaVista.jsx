import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SubastaService from "@/services/SubastaService";

const API_UPLOADS = "http://localhost:81/appmovie/api/uploads";

export function SubastaVista() {
    const { id } = useParams();
    const [subasta, setSubasta] = useState(null);

    useEffect(() => {
        SubastaService.getSubastaById(id)
            .then((r) => setSubasta(r.data.data))
            .catch(console.error);
    }, [id]);

    if (!subasta) return <p>Cargando...</p>;

    const nombre =
        subasta.nombre || subasta.objeto || "Subasta";

    const imgName =
        subasta.imagen ||
        subasta.imagen_portada ||
        subasta.imagenPortada ||
        "";

    const imgSrc = imgName
        ? `${API_UPLOADS}/${imgName}`
        : "";

    const estado = subasta.estado;

    return (
        <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                {/* Imagen */}
                <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="aspect-4/3 bg-black/20 grid place-items-center">
                        {imgSrc ? (
                            <img
                                src={imgSrc}
                                alt={nombre}
                                className="h-full w-full object-contain p-8"
                            />
                        ) : (
                            <p className="text-white/60 text-sm">
                                Imagen no disponible
                            </p>
                        )}
                    </div>
                </div>

                {/* Panel puja */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col">
                    <div className="space-y-4">
                        <p className="text-xs text-violet-200 font-semibold">
                            SUBASTA EN VIVO 
                        </p> 

                        <h1 className="text-3xl font-extrabold">{nombre}</h1>
                        {/* categoría y condición */}
                        <p className="text-sm text-white/60">
                            {(() => {
                                const cats = Array.isArray(subasta.categorias)
                                    ? subasta.categorias.map(c => c.nombre).join(', ')
                                    : subasta.categorias || '—';
                                const cond = subasta.condicion || '—';
                                return `${cats} · ${cond}`;
                            })()}
                        </p>

                        <div className="rounded-xl bg-black/20 p-4 border border-white/10">
                            <p className="text-xs text-white/60">Precio base</p>
                            <p className="text-3xl font-extrabold text-emerald-300">
                                ₡{Number(subasta.precioBase || 0).toLocaleString("es-CR")}
                            </p>
                        </div>

                        <Link
                            to={`/subastas/${id}/pujas`}
                            className="block w-full text-center rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 py-3 text-sm font-semibold text-white hover:from-violet-600 hover:to-fuchsia-600 transition"
                        >
                            HISTORIAL DE PUJAS
                        </Link>
                    </div>

                    {/* Fechas */}
                    <div className="space-y-3 mt-6 pt-4 border-t border-white/10 grow">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                            <p className="text-xs text-white/60 mb-1">Fecha de Inicio</p>
                            <p className="text-3xl font-extrabold text-white">
                                {subasta.fechaInicio}
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                            <p className="text-xs text-white/60 mb-1">
                                {estado === "CANCELADA" ? "Fecha de Cancelación" : "Fecha de Cierre"}
                            </p>
                            <p className="text-3xl font-extrabold text-white">
                                {subasta.fechafin}
                            </p>
                        </div>
                        {/* Información adicional */}
                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                            <p className="text-xs text-white/60 mb-1">Incremento mínimo</p>
                            <p className="text-3xl font-extrabold text-white">
                                ₡{Number(subasta.incre_minimo || 0).toLocaleString("es-CR")}
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                            <p className="text-xs text-white/60 mb-1">Estado</p>
                            <p className="text-3xl font-extrabold text-white">
                                {estado}
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                            <p className="text-xs text-white/60 mb-1">Total de pujas</p>
                            <p className="text-3xl font-extrabold text-white">
                                {subasta.cantidadTotalPujas ?? 0}
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/subastas"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-sm text-white/80 hover:text-white transition mt-6 pt-4 w-full"
                    >
                        ← Volver al catálogo
                    </Link>
                </div>
            </div>

            
        </div>
    );
}