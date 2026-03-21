import { useEffect, useMemo, useState } from "react";
import UsuarioService from "@/services/UsuarioService";
import { Link } from "react-router-dom";
import {
    Search,
    UserRound,
    ShieldCheck,
    CircleCheckBig,
    Ban,
    Users,
} from "lucide-react";

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
        <span className="inline-flex items-center rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold text-violet-200 ring-1 ring-violet-500/20">
            {v || "-"}
        </span>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-black/10">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                    {label}
                </p>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                    {icon}
                </div>
            </div>
            <p className="mt-4 text-2xl font-extrabold tracking-tight text-white">
                {value}
            </p>
        </div>
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

    const stats = useMemo(() => {
        const total = data.length;
        const activos = data.filter(
            (u) => String(u.estado ?? "").toUpperCase() === "ACTIVO"
        ).length;
        const bloqueados = data.filter((u) => {
            const estado = String(u.estado ?? "").toUpperCase();
            return estado === "BLOQUEADO" || estado === "INACTIVO";
        }).length;
        const roles = new Set(
            data.map((u) => String(u.rol ?? "").trim()).filter(Boolean)
        ).size;

        return { total, activos, bloqueados, roles };
    }, [data]);

    if (error) return <div className="p-6 text-white">Error: {error}</div>;

    return (
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6">
            <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-violet-500/[0.07] p-6 shadow-2xl shadow-violet-900/10">
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
                <div className="absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300/90">
                            Mantenimiento
                        </p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                            Gestión de usuarios
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-white/65">
                            Consulta, filtra y administra la información de los usuarios
                            registrados en el sistema.
                        </p>
                    </div>

                    <div className="relative w-full lg:w-[360px]">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Buscar por nombre, rol o estado..."
                            className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-10 pr-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-violet-400/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-500/15"
                        />
                    </div>
                </div>
            </section>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Total usuarios"
                    value={stats.total}
                    icon={<Users className="h-4 w-4 text-white/70" />}
                />
                <StatCard
                    label="Activos"
                    value={stats.activos}
                    icon={<CircleCheckBig className="h-4 w-4 text-emerald-300" />}
                />
                <StatCard
                    label="Bloqueados"
                    value={stats.bloqueados}
                    icon={<Ban className="h-4 w-4 text-rose-300" />}
                />
                <StatCard
                    label="Roles"
                    value={stats.roles}
                    icon={<ShieldCheck className="h-4 w-4 text-violet-300" />}
                />
            </div>

            <div className="mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] shadow-2xl shadow-violet-500/10 backdrop-blur-sm">
                <div className="border-b border-white/10 px-5 py-4">
                    <div>
                        <p className="text-sm font-semibold text-white/90">
                            Listado de usuarios
                        </p>
                        <p className="text-xs text-white/50">
                            {filtered.length} resultado{filtered.length === 1 ? "" : "s"} encontrados
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-neutral-950/40">
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-white/55">Usuario</TableHead>
                                <TableHead className="text-white/55">Rol</TableHead>
                                <TableHead className="text-white/55">Estado</TableHead>
                                <TableHead className="text-right text-white/55">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filtered.map((u, index) => {
                                const id = u.idUsuario ?? u.id ?? u.id_usuario;
                                const nombre = u.nombreCompleto ?? "-";

                                return (
                                    <TableRow
                                        key={id ?? index}
                                        className="border-white/10 transition hover:bg-white/[0.04]"
                                    >
                                        <TableCell className="text-white">
                                            <div className="flex items-center gap-3">
                                                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                                                    <UserRound className="h-5 w-5 text-white/70" />
                                                </span>

                                                <div className="min-w-0">
                                                    <Link
                                                        to={`/users/${id}`}
                                                        className="truncate text-sm font-semibold text-white transition hover:text-violet-300"
                                                    >
                                                        {nombre}
                                                    </Link>
                                                    <p className="truncate text-xs text-white/45">
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

                                        <TableCell className="text-right">
                                            <Link
                                                to={`/users/update/${id}`}
                                                state={{ usuario: u }}
                                                className="inline-flex items-center justify-center rounded-xl bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-200 ring-1 ring-violet-500/30 transition hover:bg-violet-500/20"
                                            >
                                                Editar
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                            {filtered.length === 0 && (
                                <TableRow className="border-white/10">
                                    <TableCell colSpan={4} className="py-14 text-center">
                                        <div className="flex flex-col items-center justify-center text-white/55">
                                            <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                                                <Search className="h-5 w-5" />
                                            </div>
                                            <p className="text-sm font-semibold text-white/75">
                                                No hay usuarios para mostrar
                                            </p>
                                            <p className="mt-1 text-xs text-white/45">
                                                Ajusta el texto de búsqueda para intentar de nuevo.
                                            </p>
                                        </div>
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