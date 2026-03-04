import { useEffect, useMemo, useState } from "react";
import UsuarioService from "@/services/UsuarioService";
import { Link } from "react-router-dom";
import { Search, UserRound } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

function StatusPill({ value }) {
    const v = String(value ?? "").toUpperCase();
    const isActivo = v === "ACTIVO";
    const isBloq = v === "BLOQUEADO" || v === "INACTIVO";

    const base =
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1";
    const cls = isActivo
        ? "bg-emerald-500/10 text-emerald-200 ring-emerald-500/30"
        : isBloq
            ? "bg-rose-500/10 text-rose-200 ring-rose-500/30"
            : "bg-white/5 text-white/70 ring-white/10";

    return <span className={`${base} ${cls}`}>{v || "-"}</span>;
}

function RolePill({ value }) {
    const v = String(value ?? "");
    return (
        <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/80 ring-1 ring-white/10">
            {v || "-"}
        </span>
    );
}

export default function UserList() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [q, setQ] = useState("");

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

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return data;
        return data.filter((u) => {
            const nombre = String(u.nombreCompleto ?? "").toLowerCase();
            const rol = String(u.rol ?? "").toLowerCase();
            const estado = String(u.estado ?? "").toLowerCase();
            return nombre.includes(s) || rol.includes(s) || estado.includes(s);
        });
    }, [data, q]);

    if (error) return <div className="p-6 text-white">Error: {error}</div>;

    return (
        <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6">
            {/* Header */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold text-violet-300/90">INFO</p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white">
                        Usuarios
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                        DETALLE DE CADA USUARIO
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-[340px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Buscar por nombre, rol o estado..."
                        className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white placeholder:text-white/35 outline-none ring-0 focus:border-violet-400/40 focus:bg-white/7"
                    />
                </div>
            </div>

            {/* Card Table */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-violet-500/10">
                <div className="border-b border-white/10 px-4 py-3">
                    <p className="text-sm font-semibold text-white/90">
                        {filtered.length} usuarios
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-neutral-950/40">
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-white/60">Nombre</TableHead>
                                <TableHead className="text-white/60">Rol</TableHead>
                                <TableHead className="text-white/60">Estado</TableHead>
                                
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filtered.map((u, index) => {
                                const id = u.idUsuario ?? u.id ?? u.id_usuario;
                                const nombre = u.nombreCompleto ?? "-";

                                return (
                                    <TableRow
                                        key={id ?? index}
                                        className="border-white/10 hover:bg-white/5"
                                    >
                                        <TableCell className="text-white">
                                            <div className="flex items-center gap-3">
                                                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                                                    <UserRound className="h-4 w-4 text-white/70" />
                                                </span>
                                                <div className="min-w-0">
                                                    <Link
                                                        to={`/users/${id}`}
                                                        className="truncate text-sm font-semibold hover:text-violet-300 transition"
                                                    >
                                                        {nombre}
                                                    </Link>
                                                    <p className="truncate text-xs text-white/50">
                                                        ID: {id ?? "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <RolePill value={u.rol} />
                                        </TableCell>

                                        <TableCell>
                                            <StatusPill value={u.estado} />
                                        </TableCell>

                                        
                                    </TableRow>
                                );
                            })}

                            {filtered.length === 0 && (
                                <TableRow className="border-white/10">
                                    <TableCell colSpan={4} className="py-10 text-center text-white/60">
                                        No hay usuarios para mostrar.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}