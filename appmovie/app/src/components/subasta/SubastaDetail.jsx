import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SubastaService from "@/services/SubastaService";

export function SubastaDetail() {
    const { id } = useParams();
    const [subasta, setSubasta] = useState(null);

    useEffect(() => {
        SubastaService.getSubastaById(id)
            .then((response) => {
                setSubasta(response.data.data);
            })
            .catch((error) => console.error(error));
    }, [id]);

    if (!subasta) return <p>Cargando...</p>;

    const estado = subasta.estado;

    return (
        <div className="max-w-2xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                {subasta.nombre}
            </h1>

            <img
                src={`http://localhost:81/appmovie/api/uploads/${subasta.imagen_portada}`}
                alt={subasta.nombre}
                className="w-64 rounded mb-6"
            />

            {/* subasta activa */}
            {estado === "ACTIVA" && (
                <div className="space-y-4">

                    <p><strong>Fecha inicio:</strong> {subasta.fechaInicio}</p>
                    <p><strong>Fecha cierre:</strong> {subasta.fechafin}</p>
                    <p><strong>Precio base:</strong> ₡{subasta.precioBase}</p>

                    <div className="flex justify-between mt-8">
                        <Link
                            to="/subastas"
                            className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                            ← Volver
                        </Link>

                        <Link
                            to={`/subastas/${subasta.idsubasta}/pujas`}
                            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 transition"
                        >
                            Ver Historial de Pujas
                        </Link>
                    </div>
                </div>
            )}

            {/* subasta inactiva */}
            {estado === "INACTIVA" && (
                <div className="space-y-4">

                    <p><strong>Fecha inicio:</strong> {subasta.fechaInicio}</p>
                    <p><strong>Fecha cierre:</strong> {subasta.fechafin}</p>
                    <p><strong>Precio base:</strong> ₡{subasta.precioBase}</p>

                    <div className="mt-8">
                        <Link
                            to="/subastas"
                            className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                            ← Volver
                        </Link>
                    </div>
                </div>
            )}

            {/* subasta finalizada */}
            {estado === "FINALIZADA" && (
                <div className="space-y-4">

                    <p><strong>Fecha inicio:</strong> {subasta.fechaInicio}</p>
                    <p><strong>Fecha cierre:</strong> {subasta.fechafin}</p>
                    <p><strong>Precio base:</strong> ₡{subasta.precioBase}</p>

                    <div className="mt-8">
                        <Link
                            to="/subastas"
                            className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                            ← Volver
                        </Link>
                    </div>
                </div>
            )}

            {/* Subasta cancelada */}
            {estado === "CANCELADA" && (
                <div className="space-y-4">

                    <p><strong>Precio base:</strong> ₡{subasta.precioBase}</p>

                    <p>
                        <strong>Motivo cancelación:</strong>{" "}
                        {subasta.motivoCancelacion || "Cancelada por decisión del vendedor."}
                    </p>

                    <p><strong>Fecha cancelación:</strong> {subasta.fechafin}</p>

                    <div className="mt-8">
                        <Link
                            to="/subastas"
                            className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                            ← Volver
                        </Link>
                    </div>
                </div>
            )}

        </div>
    );
}