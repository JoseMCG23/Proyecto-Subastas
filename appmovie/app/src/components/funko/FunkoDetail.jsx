import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FunkoService from "@/services/FunkoService";

export default function FunkoDetail() {
    const { id } = useParams();
    const [funko, setFunko] = useState(null);
    const [error, setError] = useState("");

    const uploadBaseUrl = import.meta.env.VITE_BASE_URL + "uploads/";

    useEffect(() => {
        FunkoService.getFunkoById(id)
            .then((res) => {
                const payload = res.data?.data ?? res.data;
                setFunko(payload);
            })
            .catch((err) => setError(err.message));
    }, [id]);

    const portada = funko?.imagen_portada ? `${uploadBaseUrl}${funko.imagen_portada}` : null;

    const galeria = useMemo(() => {
        if (!funko) return [];
        let extra = [];
        if (Array.isArray(funko.imagenes)) {
            extra = funko.imagenes.map((x) => (typeof x === "string" ? x : x?.url)).filter(Boolean);
        } else if (Array.isArray(funko.imagenes_adicionales)) {
            extra = funko.imagenes_adicionales.map((x) => (typeof x === "string" ? x : x?.url)).filter(Boolean);
        }

        const extraUrls = extra.map((img) => (img.startsWith("http") ? img : `${uploadBaseUrl}${img}`));
        return [...(portada ? [portada] : []), ...extraUrls];
    }, [funko, portada, uploadBaseUrl]);

    // ✅ Dueño “a prueba” (por si el backend manda distintos nombres)
    const dueno = useMemo(() => {
        if (!funko) return "—";
        return (
            funko.dueno ??
            funko.propietario ??
            funko.duenio ??
            funko.owner ??
            funko.usuario_nombre ??
            funko.nombreUsuario ??
            "—"
        );
    }, [funko]);

    // ✅ Historial: a veces viene como subastas[], a veces como subastaActiva
    const historial = useMemo(() => {
        if (!funko) return [];
        const arr = Array.isArray(funko.subastas) ? funko.subastas : [];
        const activa = funko.subastaActiva ? [funko.subastaActiva] : [];
        // evita duplicados por id
        const all = [...activa, ...arr];
        const seen = new Set();
        return all.filter((s) => {
            const sid = s?.idsubasta ?? s?.idSubasta ?? s?.id_subasta ?? s?.id;
            if (!sid || seen.has(sid)) return false;
            seen.add(sid);
            return true;
        });
    }, [funko]);

    if (error) return <div className="p-6 text-white">Error: {error}</div>;
    if (!funko) return <div className="p-6 text-white">Cargando...</div>;

    const categoria = Array.isArray(funko.categorias) ? funko.categorias[0] : funko.categoria;
    const condicion = funko.condicion ?? "—";
    const estado = funko.estado ?? "—";

    const fechaRegistro = funko.fechaRegistro ?? funko.fecha_registro ?? "—";

    return (
        <div className="mx-auto max-w-[1100px] px-4 py-8 text-white">
            <Link to="/funkos" className="text-sm text-white/70 hover:text-white">
                ← Volver al catálogo
            </Link>

            <div className="mt-4 grid gap-6 lg:grid-cols-2">
                {/* Imagen */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
                        {galeria[0] ? (
                            <img
                                src={galeria[0]}
                                alt={funko.nombre}
                                className="relative h-[420px] w-full object-contain p-4"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        ) : (
                            <div className="grid h-[420px] place-items-center text-sm text-white/40">
                                Sin imagen
                            </div>
                        )}
                    </div>

                    {/* mini galería */}
                    {galeria.length > 1 && (
                        <div className="mt-3 flex gap-2 overflow-auto pb-1">
                            {galeria.slice(0, 6).map((src, idx) => (
                                <button
                                    key={idx}
                                    className="shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5"
                                    onClick={(e) => e.preventDefault()}
                                    title="Vista previa"
                                >
                                    <img src={src} alt={`img-${idx}`} className="h-16 w-16 object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
                        {categoria && (
                            <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-violet-200">
                                {categoria}
                            </span>
                        )}
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                            {condicion}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                            {estado}
                        </span>
                    </div>

                    <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
                        {funko.nombre ?? "Funko"}
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                        {funko.descripcion ?? "—"}
                    </p>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-4">
                        <div className="grid gap-3 text-sm">
                            <Row label="Dueño" value={dueno} />
                            <Row label="Fecha registro" value={fechaRegistro} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Historial */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Historial de subastas del objeto</h3>
                <p className="mt-1 text-sm text-white/60">ID, inicio, cierre y estado.</p>

                {historial.length > 0 ? (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-white/70">
                                <tr>
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Inicio</th>
                                    <th className="px-4 py-3">Cierre</th>
                                    <th className="px-4 py-3">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historial.map((s, idx) => {
                                    const sid = s?.idsubasta ?? s?.idSubasta ?? s?.id_subasta ?? s?.id ?? idx + 1;
                                    const ini = s?.fechaInicio ?? s?.fecha_inicio ?? "—";
                                    const fin = s?.fechafin ?? s?.fechaFin ?? s?.fecha_fin ?? "—";
                                    const est = s?.estado ?? "—";

                                    return (
                                        <tr key={sid} className="border-t border-white/10">
                                            <td className="px-4 py-3">{sid}</td>
                                            <td className="px-4 py-3">{ini}</td>
                                            <td className="px-4 py-3">{fin}</td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                                                    {est}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-white/70">Este funko no tiene historial de subastas.</p>
                )}
            </div>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-white/70">{label}</span>
            <span className="font-semibold">{value ?? "—"}</span>
        </div>
    );
}