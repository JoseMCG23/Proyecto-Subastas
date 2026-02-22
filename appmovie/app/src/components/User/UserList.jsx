import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UsuarioService from "@/services/UsuarioService";

export default function UserList() {
    const [data, setData] = useState([]); // siempre  array
    const [error, setError] = useState("");

    useEffect(() => {
        UsuarioService.getUsuarios()
            .then((res) => {

                const payload = res.data;

                if (Array.isArray(payload)) {
                    setData(payload);
                } else if (payload && Array.isArray(payload.data)) {
                    setData(payload.data);
                } else if (payload && Array.isArray(payload.results)) {
                    setData(payload.results);
                } else if (payload && Array.isArray(payload.usuarios)) {
                    setData(payload.usuarios);
                } else {
                    console.log("RESPUESTA USUARIOS (NO ARRAY):", payload);
                    setData([]); // evita crash
                }
            })
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <div style={{ padding: 16 }}>Error: {error}</div>;

    return (
        <div style={{ padding: 16 }}>
            <h2>Usuarios</h2>

            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Nombre completo</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((u) => (
                        <tr key={u.idUsuario}>
                            <td>{u.nombreCompleto}</td>
                            <td>{u.rol}</td>
                            <td>{u.estado}</td>
                            <td>
                                <Link to={`/users/${u.idUsuario}`}>Ver detalle</Link>
                            </td>
                        </tr>
                    ))}

                    {data.length === 0 && (
                        <tr>
                            <td colSpan="4">No hay usuarios</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}