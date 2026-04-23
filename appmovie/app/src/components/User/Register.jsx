import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import UsuarioService from "@/services/UsuarioService";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const payload = {
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                password: data.password,
                cedula: data.cedula,
                direccion: data.direccion,
            };

            const response = await UsuarioService.createUsuario(payload);

            if (response?.data?.success) {
                toast.success("Usuario registrado correctamente");
                navigate("/login");
            } else {
                toast.error("Error al registrar usuario");
            }
        } catch (error) {
            console.error("Error register:", error);
            const mensaje =
                error?.response?.data?.message ||
                "Error al registrar usuario";
            toast.error(mensaje);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md bg-white/10 text-white border border-white/10 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">
                        Registro de Usuario
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        <div>
                            <Label>Nombre</Label>
                            <Input {...register("nombre")} />
                        </div>

                        <div>
                            <Label>Apellido</Label>
                            <Input {...register("apellido")} />
                        </div>

                        <div>
                            <Label>Correo</Label>
                            <Input {...register("correo")} />
                        </div>

                        <div>
                            <Label>Contraseña</Label>
                            <Input type="password" {...register("password")} />
                        </div>

                        <div>
                            <Label>Cédula</Label>
                            <Input {...register("cedula")} />
                        </div>

                        <div>
                            <Label>Dirección</Label>
                            <Input {...register("direccion")} />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-2"
                        >
                            {isSubmitting ? "Registrando..." : "Registrarse"}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}