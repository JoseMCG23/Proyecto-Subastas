import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SubastaService from "@/services/SubastaService";

export function HistorialPujas() {
    const { id } = useParams();
    const [pujas, setPujas] = useState([]);

    useEffect(() => {
        SubastaService.getPujasBySubasta(id)
            .then((response) => {
                setPujas(response.data.data || []);
            })
            .catch((error) => console.error(error));
    }, [id]);

    return (
        <div className="max-w-3xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                Historial de Pujas
            </h1>

            {pujas.length === 0 ? (
                <p className="text-gray-600">
                    No hay pujas registradas para esta subasta.
                </p>
            ) : (
                <div className="space-y-4">
                    {pujas.map((puja, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-4 shadow-sm bg-white"
                        >
                            <p><strong>Usuario:</strong> {puja.usuario}</p>
                            <p><strong>Monto:</strong> ₡{puja.monto}</p>
                            <p><strong>Fecha y hora:</strong> {puja.fechaYhora}</p>
                        </div>
                    ))}
                </div>
            )}

            <Link
                to={`/subastas/${id}`}
                className="inline-block mt-6 px-5 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition"
            >
                ← Volver a la subasta
            </Link>
        </div>
    );
}