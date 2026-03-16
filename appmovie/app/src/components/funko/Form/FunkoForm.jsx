import PropTypes from "prop-types";
import { Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Package, Plus, Trash2 } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom/custom-select";
import { CustomMultiSelect } from "@/components/ui/custom/custom-multiple-select";
import { CustomInputField } from "@/components/ui/custom/custom-input-field";

FunkoForm.propTypes = {
    control: PropTypes.object.isRequired,
    errors: PropTypes.object,
    dataCategorias: PropTypes.array.isRequired,
    usuarioActual: PropTypes.object.isRequired,
    fileURLs: PropTypes.array,
    onChangeImage: PropTypes.func.isRequired,
};

export function FunkoForm({
    control,
    errors,
    dataCategorias,
    usuarioActual,
    fileURLs = [],
    onChangeImage,
}) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "imagenes",
    });

    const addNewImage = () => append({ urlImagen: "" });

    const removeImage = (index) => {
        if (fields.length > 1) remove(index);
    };

    return (
        <div className="space-y-6">
            <div className="mb-4 p-4 border rounded-lg shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Package className="w-6 h-6 text-muted-foreground" />
                    <h3 className="text-base font-semibold">Información del funko</h3>
                </div>

                <div>
                    <Controller
                        name="nombre"
                        control={control}
                        render={({ field }) => (
                            <CustomInputField
                                {...field}
                                label="Nombre"
                                placeholder="Ingrese el nombre del funko"
                                error={errors?.nombre?.message}
                            />
                        )}
                    />
                </div>

                <div>
                    <Label className="block mb-1 text-sm font-medium">
                        Descripción
                    </Label>
                    <Controller
                        name="descripcion"
                        control={control}
                        render={({ field }) => (
                            <textarea
                                {...field}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px]"
                                placeholder="Ingrese la descripción del funko"
                            />
                        )}
                    />
                    {errors?.descripcion && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.descripcion.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Controller
                            name="condicion"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    field={field}
                                    data={[
                                        { id: "Nuevo", nombre: "Nuevo" },
                                        { id: "Usado", nombre: "Usado" },
                                    ]}
                                    label="Condición"
                                    getOptionLabel={(item) => item.nombre}
                                    getOptionValue={(item) => item.id}
                                    error={errors?.condicion?.message}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <CustomInputField
                            value="Activo"
                            label="Estado inicial"
                            disabled
                        />
                    </div>
                </div>

                <div>
                    <CustomInputField
                        value={usuarioActual?.nombre || ""}
                        label="Usuario vendedor"
                        disabled
                    />
                </div>

                <div>
                    <Controller
                        name="categorias"
                        control={control}
                        render={({ field }) => (
                            <CustomMultiSelect
                                field={field}
                                data={dataCategorias}
                                label="Categorías"
                                getOptionLabel={(item) => item.nombre}
                                getOptionValue={(item) => item.idCategoria}
                                error={errors?.categorias?.message}
                                placeholder="Seleccione categorías"
                            />
                        )}
                    />
                </div>
            </div>

            <div className="mb-4 p-4 border rounded-lg shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">Imágenes</h3>
                    <Button
                        type="button"
                        size="icon"
                        onClick={addNewImage}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="p-4 border rounded-lg flex flex-col gap-4"
                        >
                            <div className="text-sm font-medium">
                                Imagen {index + 1}
                            </div>

                            <div
                                className="relative w-56 h-56 border-2 border-dashed border-muted/50 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors"
                                onClick={() =>
                                    document.getElementById(`image-${index}`)?.click()
                                }
                            >
                                {!fileURLs[index] && (
                                    <div className="text-center px-4">
                                        <p className="text-sm text-muted-foreground">
                                            Haz clic o arrastra una imagen
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            (jpg, png, máximo 5MB)
                                        </p>
                                    </div>
                                )}

                                {fileURLs[index] && (
                                    <img
                                        src={fileURLs[index]}
                                        alt={`preview-${index}`}
                                        className="w-full h-full object-contain rounded-lg shadow-sm"
                                    />
                                )}
                            </div>

                            <input
                                type="file"
                                id={`image-${index}`}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => onChangeImage(e, index)}
                            />

                            <Controller
                                name={`imagenes.${index}.urlImagen`}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nombre de la imagen"
                                        readOnly
                                    />
                                )}
                            />

                            {errors?.imagenes?.[index]?.urlImagen && (
                                <p className="text-sm text-red-500">
                                    {errors.imagenes[index].urlImagen.message}
                                </p>
                            )}

                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => removeImage(index)}
                                    disabled={fields.length === 1}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FunkoForm;