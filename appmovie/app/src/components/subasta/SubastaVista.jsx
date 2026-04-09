import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Pusher from "pusher-js";
import SubastaService from "@/services/SubastaService";

const API_UPLOADS = "http://localhost:81/appmovie/api/uploads";

// variable lógica interna para pruebas
const usuarioActualId = 6;

export function SubastaVista() {
    const { id } = useParams();
    const [subasta, setSubasta] = useState(null);
    const [resultadoCierre, setResultadoCierre] = useState(null);
    const [montoPuja, setMontoPuja] = useState("");
    const [isSubmittingPuja, setIsSubmittingPuja] = useState(false);

    const cargarSubasta = async () => {
        try {
            const cierreRes = await SubastaService.cerrarSubasta(id);
            setResultadoCierre(cierreRes.data?.data ?? null);

            const subastaRes = await SubastaService.getSubastaById(id);
            setSubasta(subastaRes.data?.data ?? null);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        cargarSubasta();
    }, [id]);

    useEffect(() => {
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        });

        const channel = pusher.subscribe(`subasta-${id}`);

        channel.bind("subasta-cerrada", (data) => {
            setResultadoCierre({
                resultado: data.resultado,
                pago: data.pago,
            });

            setSubasta((prev) =>
                prev
                    ? {
                        ...prev,
                        estado: data.estado || "FINALIZADA",
                    }
                    : prev
            );

            toast.success("La subasta se finalizó automáticamente");
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [id]);

    if (!subasta) return <p>Cargando...</p>;

    const nombre = subasta.nombre || subasta.objeto || "Subasta";

    const imgName =
        subasta.imagen ||
        subasta.imagen_portada ||
        subasta.imagenPortada ||
        "";

    const imgSrc = imgName ? `${API_UPLOADS}/${imgName}` : "";

    const estado = subasta.estado;
    const resultado = resultadoCierre?.resultado ?? null;
    const pago = resultadoCierre?.pago ?? null;

    const subastaCerrada = estado === "FINALIZADA" || estado === "CANCELADA";
    const puedePujar = estado === "ACTIVA";

    const handlePujar = async (e) => {
        e.preventDefault();

        if (!puedePujar) {
            toast.error("No se puede pujar en esta subasta");
            return;
        }

        const monto = Number(montoPuja);

        if (!monto || monto <= 0) {
            toast.error("Ingrese un monto válido");
            return;
        }

        try {
            setIsSubmittingPuja(true);

            await SubastaService.createPuja({
                subastaId: Number(id),
                usuarioId: usuarioActualId,
                monto,
            });

            toast.success("Puja registrada correctamente");
            setMontoPuja("");
            await cargarSubasta();
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "No se pudo registrar la puja"
            );
        } finally {
            setIsSubmittingPuja(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
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

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col">
                    <div className="space-y-4">
                        <p className="text-xs text-violet-200 font-semibold">
                            SUBASTA EN VIVO
                        </p>

                        <h1 className="text-3xl font-extrabold">{nombre}</h1>
                        <p className="text-sm text-white/60">
                            {(() => {
                                const cats = Array.isArray(subasta.categorias)
                                    ? subasta.categorias.map(c => c.nombre).join(", ")
                                    : subasta.categorias || "—";
                                const cond = subasta.condicion || "—";
                                return `${cats} · ${cond}`;
                            })()}
                        </p>

                        <div className="rounded-xl bg-black/20 p-4 border border-white/10">
                            <p className="text-xs text-white/60">Precio base</p>
                            <p className="text-3xl font-extrabold text-emerald-300">
                                ₡{Number(subasta.precioBase || 0).toLocaleString("es-CR")}
                            </p>
                        </div>

                        {resultado && (
                            <div className="rounded-xl bg-black/20 p-4 border border-white/10">
                                <p className="text-xs text-white/60 mb-2">Resultado del cierre</p>

                                {resultado.estado_resultado === "CON_GANADOR" ? (
                                    <div className="space-y-2">
                                        <p className="text-lg font-bold text-emerald-300">
                                            Ganador: {resultado.ganador_nombre || `Usuario #${resultado.usuario_ganador_id}`}
                                        </p>
                                        <p className="text-sm text-white/80">
                                            Monto final: ₡{Number(resultado.monto_final || 0).toLocaleString("es-CR")}
                                        </p>
                                        {pago && (
                                            <p className="text-sm text-white/80">
                                                Estado del pago: {pago.estado}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-lg font-bold text-amber-300">
                                        Subasta finalizada sin ofertas
                                    </p>
                                )}
                            </div>
                        )}

                        {puedePujar ? (
                            <form
                                onSubmit={handlePujar}
                                className="rounded-xl bg-black/20 p-4 border border-white/10 space-y-3"
                            >
                                <p className="text-xs text-white/60">Registrar puja</p>

                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={montoPuja}
                                    onChange={(e) => setMontoPuja(e.target.value)}
                                    placeholder="Ingrese el monto de la puja"
                                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-violet-400/40"
                                />

                                <button
                                    type="submit"
                                    disabled={isSubmittingPuja}
                                    className="w-full rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 py-3 text-sm font-semibold text-white hover:from-violet-600 hover:to-fuchsia-600 transition disabled:opacity-50"
                                >
                                    {isSubmittingPuja ? "Procesando..." : "REALIZAR PUJA"}
                                </button>
                            </form>
                        ) : (
                            <div className="rounded-xl bg-red-500/10 p-4 border border-red-400/20">
                                <p className="text-sm font-semibold text-red-200">
                                    {subastaCerrada
                                        ? "Esta subasta ya finalizó. No se permiten nuevas pujas."
                                        : "Esta subasta no está activa. No se permiten nuevas pujas."}
                                </p>
                            </div>
                        )}

                        <Link
                            to={`/subastas/${id}/pujas`}
                            className="block w-full text-center rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 py-3 text-sm font-semibold text-white hover:from-violet-600 hover:to-fuchsia-600 transition"
                        >
                            HISTORIAL DE PUJAS
                        </Link>
                    </div>

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