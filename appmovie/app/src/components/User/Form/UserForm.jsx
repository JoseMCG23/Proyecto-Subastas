import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { User } from "lucide-react";
import { CustomInputField } from "@/components/ui/custom/custom-input-field";

UserForm.propTypes = {
    control: PropTypes.object.isRequired,
    errors: PropTypes.object,
};

export function UserForm({ control, errors }) {
    return (
        <div className="mb-4 p-4 border rounded-lg shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-muted-foreground" />
                <h3 className="text-base font-semibold">Información del usuario</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full md:col-span-2">
                    <Controller
                        name="nombreCompleto"
                        control={control}
                        render={({ field }) => (
                            <CustomInputField
                                {...field}
                                label="Nombre completo"
                                placeholder="Ingrese el nombre completo"
                                error={errors?.nombreCompleto?.message}
                            />
                        )}
                    />
                </div>

                <div className="w-full md:col-span-2">
                    <Controller
                        name="correo"
                        control={control}
                        render={({ field }) => (
                            <CustomInputField
                                {...field}
                                label="Correo"
                                placeholder="Ingrese el correo"
                                error={errors?.correo?.message}
                            />
                        )}
                    />
                </div>

                <div className="w-full">
                    <Controller
                        name="rol"
                        control={control}
                        render={({ field }) => (
                            <CustomInputField {...field} label="Rol" disabled />
                        )}
                    />
                </div>

                <div className="w-full">
                    <Controller
                        name="fechaRegistro"
                        control={control}
                        render={({ field }) => (
                            <CustomInputField {...field} label="Fecha de registro" disabled />
                        )}
                    />
                </div>
            </div>
        </div>
    );
}