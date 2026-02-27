import { useEffect, useState } from "react";
import SubastaService from "@/services/SubastaService";
import { Link } from "react-router-dom";

export function SubastaList() {
    const [subastas, setSubastas] = useState([]);

    useEffect(() => {
        SubastaService.getSubastas()
        .then((response) => {
            setSubastas(response.data.data);
        })
        .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Listado de Subastas
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subastas.map((subasta) => (
                    <div
                        key={subasta.idsubasta}
                        className="border rounded-lg p-4 shadow hover:shadow-lg transition"
                    >

                        <h2 className="text-xl font-semibold mb-2">
                            {subasta.objeto}
                        </h2>

                        <img
                            src={`http://localhost:81/appmovie/api/uploads/${subasta.imagen}`}
                            alt={subasta.objeto}
                            className="w-full h-64 object-contain rounded mb-3 bg-white"
                        />

                        <p className="text-sm mb-1">
                            <strong>Categoría(s):</strong>{" "}
                            {subasta.categorias && subasta.categorias.length > 0
                                ? subasta.categorias.map(cat => cat.nombre).join(", ")
                                : "Sin categoría"}
                        </p>

                        <p className="text-sm mb-1">
                            <strong>Condición:</strong> {subasta.condicion}
                        </p>

                        <p className="text-sm mb-1">
                            <strong>Precio Base:</strong> ₡{subasta.precioBase}
                        </p>

                        <Link
                            to={`/subastas/${subasta.idsubasta}`}
                            className="block w-full text-center mt-4 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-neutral-800 transition"
                        >
                            Ver detalles
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}