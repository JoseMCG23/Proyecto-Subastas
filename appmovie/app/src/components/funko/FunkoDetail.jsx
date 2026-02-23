import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FunkoService from "@/services/FunkoService";

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";

export default function FunkoDetail() {
    const { id } = useParams();
    const [funko, setFunko] = useState(null);
    const [error, setError] = useState("");

    // omg (API/uploads)
    const uploadBaseUrl = import.meta.env.VITE_BASE_URL + "uploads/";

    useEffect(() => {
        FunkoService.getFunkoById(id)
            .then((res) => {
        
                const payload = res.data?.data ?? res.data;
                setFunko(payload);
            })
            .catch((err) => setError(err.message));
    }, [id]);

    if (error) return <div className="p-4">Error: {error}</div>;
    if (!funko) return <div className="p-4">Cargando...</div>;

    //img portada 
    const portada = funko.imagen_portada ? `${uploadBaseUrl}${funko.imagen_portada}` : null;

    // img extra 
    let imagenes = [];
    if (Array.isArray(funko.imagenes)) {
        imagenes = funko.imagenes.map((x) => (typeof x === "string" ? x : x?.url)).filter(Boolean);
    } else if (Array.isArray(funko.imagenes_adicionales)) {
        imagenes = funko.imagenes_adicionales.map((x) => (typeof x === "string" ? x : x?.url)).filter(Boolean);
    }

    // si no hay mas img se muestra solo portada
    const galeria = [
        ...(portada ? [portada] : []),
        ...imagenes.map((img) => (img.startsWith("http") ? img : `${uploadBaseUrl}${img}`)),
    ];

    return (
        <div className="p-4">
            <Link className="underline" to="/funkos">← Volver</Link>

            <h2 className="text-xl font-bold mt-2">Detalle de Objeto (Funko)</h2>

            {/*galeria */}
            <div className="mt-4 flex gap-3 flex-wrap">
                {galeria.length > 0 ? (
                    galeria.map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`Funko ${idx + 1}`}
                            className="h-28 w-28 object-cover rounded border"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ))
                ) : (
                    <div className="opacity-60">Sin imágenes</div>
                )}
            </div>

            {/*info */}
            <div className="mt-4 border rounded-md">
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Nombre</TableCell>
                            <TableCell>{funko.nombre ?? "-"}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="font-medium">Descripción</TableCell>
                            <TableCell>{funko.descripcion ?? "-"}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="font-medium">Categorías</TableCell>
                            <TableCell>
                                {Array.isArray(funko.categorias) ? funko.categorias.join(", ") : "-"}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="font-medium">Condición</TableCell>
                            <TableCell>{funko.condicion ?? "-"}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="font-medium">Estado</TableCell>
                            <TableCell>{funko.estado ?? "-"}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="font-medium">Fecha registro</TableCell>
                            <TableCell>{funko.fechaRegistro ?? funko.fecha_registro ?? "-"}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="font-medium">Dueño</TableCell>
                            <TableCell>{funko.dueno ?? funko.propietario ?? "-"}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}