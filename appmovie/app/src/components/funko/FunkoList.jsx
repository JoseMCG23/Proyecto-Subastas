import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FunkoService from "@/services/FunkoService";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function FunkoList() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");

    //ruta para imágenes (API/uploads)
    // http://localhost:81/appmovie/api/uploads/MilesMorales.png
    const uploadBaseUrl = import.meta.env.VITE_BASE_URL + "uploads/";

    useEffect(() => {
        FunkoService.getFunkos()
            .then((res) => {
             
                const payload = res.data?.data;

                if (Array.isArray(payload)) setData(payload);
                else {
                    console.log("RESPUESTA FUNKO (NO ARRAY):", res.data);
                    setData([]);
                }
            })
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <div className="p-4">Error: {error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Listado de Objetos (Funkos)</h2>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {/* los 4 campos */}
                            <TableHead>Imagen</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Categorías</TableHead>
                            <TableHead>Dueño</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((f, index) => {
                            const id = f.idFunko ?? f.id ?? f.id_funko;

                            // imagen_portada viene del api)
                            const imgName = f.imagen_portada;
                            const imgUrl = imgName ? `${uploadBaseUrl}${imgName}` : null;

                            return (
                                <TableRow key={id ?? index}>
                                    {/*img principal */}
                                    <TableCell>
                                        {imgUrl ? (
                                            <img
                                                src={imgUrl}
                                                alt={f.nombre}
                                                className="h-12 w-12 object-cover rounded"
                                                onError={(e) => {
                                                    // si falla la imagen se oculta
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <span className="opacity-60">Sin imagen</span>
                                        )}
                                    </TableCell>

                                    {/* nombre*/}
                                    <TableCell>
                                        {id ? (
                                            <Link className="underline" to={`/funkos/${id}`}>
                                                {f.nombre}
                                            </Link>
                                        ) : (
                                            f.nombre
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {Array.isArray(f.categorias) ? f.categorias.join(", ") : "-"}
                                    </TableCell>

                                    <TableCell>{f.dueno ?? "-"}</TableCell>
                                </TableRow>
                            );
                        })}

                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4}>No hay funkos</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/*por si algna imagen no carga*/}
            <p className="text-sm opacity-70 mt-3">
                Si alguna imagen no aparece, probá abrirla directo así:
                {" "}
                <span className="underline">
                    http://localhost:81/appmovie/api/uploads/NOMBRE.png
                </span>
            </p>
        </div>
    );
}