//////USER LOST
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UsuarioService from "@/services/UsuarioService";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function UserList() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        UsuarioService.getUsuarios()
            .then((res) => {
                const payload = res.data;

                if (Array.isArray(payload)) setData(payload);
                else if (payload && Array.isArray(payload.data)) setData(payload.data);
                else if (payload && Array.isArray(payload.results)) setData(payload.results);
                else if (payload && Array.isArray(payload.usuarios)) setData(payload.usuarios);
                else {
                    console.log("RESPUESTA USUARIOS (NO ARRAY):", payload);
                    setData([]);
                }
            })
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <div className="p-4">Error: {error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Usuarios</h2>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre completo</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acción</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((u, index) => {
                            const id = u.idUsuario ?? u.id ?? u.id_usuario; 

                            return (
                                <TableRow key={id ?? index}>
                                    <TableCell>{u.nombreCompleto}</TableCell>
                                    <TableCell>{u.rol}</TableCell>
                                    <TableCell>{u.estado}</TableCell>

                                    <TableCell>
                                        {id ? (
                                            <Link className="underline" to={`/users/${id}`}>
                                                Ver detalle
                                            </Link>
                                        ) : (
                                            <span className="opacity-60">Sin ID</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4}>No hay usuarios</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}