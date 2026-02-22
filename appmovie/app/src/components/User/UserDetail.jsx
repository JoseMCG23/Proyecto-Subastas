import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UsuarioService from "@/services/UsuarioService";

export default function UserDetail() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        UsuarioService.getUsuarioById(id)
            .then((res) => {
                console.log("DETALLE RAW:", res.data);

             
                const payload = res.data?.data ?? res.data;
                console.log("DETALLE USANDO:", payload);

                setUser(payload);
            })
            .catch((err) => setError(err.message));
    }, [id]);

    if (error) return <div style={{ padding: 16 }}>Error: {error}</div>;
    if (!user) return <div style={{ padding: 16 }}>Cargando...</div>;

    return (
        <div style={{ padding: 16 }}>
            <Link to="/users">← Volver</Link>
            <h2>Detalle Usuario</h2>

            <p><b>Nombre completo:</b> {user.nombreCompleto ?? user.nombre_completo ?? "-"}</p>
            <p><b>Rol:</b> {user.rol ?? "-"}</p>
            <p><b>Estado:</b> {user.estado ?? "-"}</p>
            <p><b>Fecha registro:</b> {user.fechaRegistro ?? user.fecha_registro ?? "-"}</p>

            <hr />

            {/*camps calculados*/}
            {String(user.rol).toLowerCase() === "vendedor" && (
                <p><b>Subastas creadas:</b> {user.cantidadSubastasCreadas ?? 0}</p>
            )}

            {String(user.rol).toLowerCase() === "comprador" && (
                <p><b>Pujas realizadas:</b> {user.cantidadPujasRealizadas ?? 0}</p>
            )}
        </div>
    );
}