import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SubastaService from "@/services/SubastaService";

const API_UPLOADS = "http://localhost:81/appmovie/api/uploads";

const CATS = ["Todas", "Marvel", "DC", "Disney", "Anime", "Star Wars", "Exclusivo"];
const ESTADOS = ["Todas", "ACTIVA", "FINALIZADA", "CANCELADA", "INACTIVA"];

export function SubastaList({ onCreate, onEdit, onViewDetail, onPublish, onCancel }) {
    const [subastas, setSubastas] = useState([]);
    const [error, setError] = useState("");
    const [activeCat, setActiveCat] = useState("Todas");
    const [activeEstado, setActiveEstado] = useState("Todas");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setIsLoading(true);

                // Cargar subastas
                const subastaRes = await SubastaService.getSubastas();
                const subastasList = subastaRes.data.data || subastaRes.data || [];
                setSubastas(Array.isArray(subastasList) ? subastasList : []);
            } catch (err) {
                console.error(err);
                setError("Error al cargar los datos");
            } finally {
                setIsLoading(false);
            }
        };

        cargarDatos();
    }, []);

    // Filtrado
    const filtered = useMemo(() => {
        return subastas.filter((s) => {
            const categorias = (s.categorias || "").toLowerCase();
            const estado = s.estado || "";

            const matchCat =
                activeCat === "Todas" ||
                categorias.includes(activeCat.toLowerCase());

            const matchEstado =
                activeEstado === "Todas" ||
                estado === activeEstado;

            return matchCat && matchEstado;
        });
    }, [subastas, activeCat, activeEstado]);

    if (error) return <div className="p-6 text-white">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
            <div className="mx-auto w-full max-w-7xl px-6 pb-12 pt-8">
                {/* Encabezado */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
                >
                    <div>
                        <motion.p
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-sm font-bold text-violet-400/90 uppercase tracking-wider"
                        >
                            ADMINISTRACIÓN
                        </motion.p>
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-2 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent"
                        >
                            Mantenimiento de Subastas
                        </motion.h1>
                        <motion.p
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-2 text-lg text-white/70"
                        >
                            Creación, edición y administración de subastas
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Button
                            onClick={onCreate}
                            className="h-12 px-6 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-3"
                            disabled={isLoading}
                        >
                            Nueva Subasta
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Filtros */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8 space-y-6"
                >
                    {/* Filtro por Categoría */}
                    <Card className="bg-gradient-to-r from-white/10 to-white/5 border-white/20 shadow-xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-white">
                                Filtrar por Categoría
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                {CATS.map((cat) => (
                                    <motion.button
                                        key={cat}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveCat(cat)}
                                        className={`px-6 py-3 rounded-full text-sm font-bold ring-2 transition-all duration-200 ${
                                            activeCat === cat
                                                ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white ring-violet-400 shadow-lg shadow-violet-500/30"
                                                : "bg-gradient-to-r from-white/10 to-white/5 text-white/80 hover:text-white ring-white/20 hover:ring-white/40 hover:bg-white/20"
                                        }`}
                                    >
                                        {cat}
                                    </motion.button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Filtro por Estado */}
                    <Card className="bg-gradient-to-r from-white/10 to-white/5 border-white/20 shadow-xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-white">
                                Filtrar por Estado
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                {ESTADOS.map((estado) => (
                                    <motion.button
                                        key={estado}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveEstado(estado)}
                                        className={`px-6 py-3 rounded-full text-sm font-bold ring-2 transition-all duration-200 ${
                                            activeEstado === estado
                                                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white ring-emerald-400 shadow-lg shadow-emerald-500/30"
                                                : "bg-gradient-to-r from-white/10 to-white/5 text-white/80 hover:text-white ring-white/20 hover:ring-white/40 hover:bg-white/20"
                                        }`}
                                    >
                                        {estado}
                                    </motion.button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Listado */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    {/* Total de subastas */}
                    <div className="mb-6">
                        <p className="text-lg font-bold text-white/90">
                            {filtered.length} subasta{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {filtered.length === 0 ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-16 text-center shadow-2xl"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-xl text-white/60 font-semibold">No hay subastas para mostrar</p>
                                <p className="text-white/40">Prueba con otros filtros o crea una nueva subasta</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {filtered.map((s, index) => {
                                const imgName = s.imagen || s.imagen_portada || s.imagenPortada || "";
                                const imgSrc = imgName ? `${API_UPLOADS}/${imgName}` : "";

                                const pujasCount = Number(s?.cantidadPujas ?? s?.cantidadTotalPujas ?? 0);
                                const canEdit = s.estado === "INACTIVA" && pujasCount === 0;
                                const canPublish = s.estado === "INACTIVA";
                                const canCancel = s.estado === "INACTIVA";

                                return (
                                    <motion.div
                                        key={s.idsubasta}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 * index }}
                                        whileHover={{ y: -8 }}
                                        className="group overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 shadow-2xl shadow-violet-500/10 transition-all duration-300 hover:border-violet-400/40 hover:shadow-violet-500/20 relative flex flex-col"
                                    >
                                        {/* Imagen  */}
                                        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-black/30 to-black/10">
                                            {imgSrc ? (
                                                <img
                                                    src={imgSrc}
                                                    alt={s.objeto || s.nombre}
                                                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="grid h-full w-full place-items-center text-white/40">
                                                    <div className="text-center">
                                                        <p className="text-sm">Sin imagen</p>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Overlay con gradiente */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>

                                        {/* Contenido */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            {/* Título */}
                                            <h3 className="font-bold text-xl text-white mb-2 line-clamp-2 min-h-[3.75rem] group-hover:text-violet-300 transition-colors duration-200">
                                                {s.objeto || s.nombre}
                                            </h3>

                                            {/* Información */}
                                            <div className="mt-4 flex-1 flex flex-col justify-between min-h-[155px]">
                                                <div className="mb-4">
                                                    <p className="text-sm text-white/60 mb-1">
                                                        Precio base
                                                    </p>
                                                    <p className="text-2xl font-extrabold text-emerald-300">
                                                        ₡{Number(s.precioBase || 0).toLocaleString("es-CR")}
                                                    </p>
                                                </div>

                                                <div className="flex gap-3 text-xs">
                                                    <div className="flex-1 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl px-3 py-2">
                                                        <p className="text-white/50 text-[10px] uppercase tracking-wide mb-1">Pujas</p>
                                                        <p className="font-bold text-violet-300 text-sm">
                                                            {s.cantidadPujas || 0}
                                                        </p>
                                                    </div>

                                                    <div className="flex-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl px-3 py-2">
                                                        <p className="text-white/50 text-[10px] uppercase tracking-wide mb-1">Incremento</p>
                                                        <p className="font-bold text-blue-300 text-sm">
                                                            ₡{Number(s.incre_minimo || 0).toLocaleString("es-CR")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Botones */}
                                            <div className="flex gap-3 mt-6 pt-4 border-t border-white/20">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => onViewDetail(s)}
                                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white/80 hover:text-white text-sm font-semibold py-3 transition-all duration-200 border border-white/20 hover:border-white/40"
                                                    title="Ver detalle"
                                                >
                                                    Ver
                                                </motion.button>

                                                {canEdit && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => onEdit(s)}
                                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-blue-300 hover:text-blue-200 text-sm font-semibold py-3 transition-all duration-200 border border-blue-500/30 hover:border-blue-400/50"
                                                        title="Editar"
                                                    >
                                                        Editar
                                                    </motion.button>
                                                )}

                                                {canPublish && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => onPublish(s.idsubasta)}
                                                        disabled={isLoading}
                                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 text-emerald-300 hover:text-emerald-200 text-sm font-semibold py-3 transition-all duration-200 border border-emerald-500/30 hover:border-emerald-400/50 disabled:opacity-50"
                                                        title="Publicar"
                                                    >
                                                        Publicar
                                                    </motion.button>
                                                )}

                                                {canCancel && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => onCancel(s.idsubasta)}
                                                        disabled={isLoading}
                                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 hover:text-red-200 text-sm font-semibold py-3 transition-all duration-200 border border-red-500/30 hover:border-red-400/50 disabled:opacity-50"
                                                        title="Cancelar"
                                                    >
                                                        Cancelar
                                                    </motion.button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default SubastaList;