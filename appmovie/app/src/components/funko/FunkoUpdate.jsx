import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// icons
import { Save, ArrowLeft } from "lucide-react";

// servicios
import FunkoService from "@/services/FunkoService";
import CategoriaService from "@/services/CategoriaService";
import ImageService from "@/services/ImageService";

// form reutilizable
import { FunkoForm } from "@/components/funko/Form/FunkoForm";

// Usuario vendedor simulado
const usuarioActual = {
    id: 2,
    nombre: "Usuario Vendedor Simulado",
};

export function FunkoUpdate() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [dataCategorias, setDataCategorias] = useState([]);
    const [files, setFiles] = useState([]);
    const [fileURLs, setFileURLs] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [funkoActual, setFunkoActual] = useState(null);
    const [bloqueado, setBloqueado] = useState(false);

    const funkoSchema = yup.object({
        idFunko: yup.number().required(),
        nombre: yup
            .string()
            .required("El nombre es requerido")
            .min(2, "El nombre debe tener mínimo 2 caracteres"),
        descripcion: yup
            .string()
            .required("La descripción es requerida")
            .min(20, "La descripción debe tener mínimo 20 caracteres"),
        condicion: yup
            .string()
            .required("La condición es requerida"),
        categorias: yup
            .array()
            .min(1, "Debe seleccionar al menos una categoría"),
        imagenes: yup.array().of(
            yup.object().shape({
                urlImagen: yup.string().nullable(),
            })
        ),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        defaultValues: {
            idFunko: "",
            nombre: "",
            descripcion: "",
            condicion: "",
            estado: "Activo",
            vendedor_id: usuarioActual.id,
            categorias: [],
            imagenes: [{ urlImagen: "" }],
        },
        resolver: yupResolver(funkoSchema),
    });

    const uploadBaseUrl = import.meta.env.VITE_BASE_URL + "uploads/";

    const tieneSubastaActiva = useMemo(() => {
        if (!funkoActual) return false;

        const arr = Array.isArray(funkoActual.subastas) ? funkoActual.subastas : [];
        return arr.some((s) => String(s?.estado ?? "").toLowerCase() === "activa");
    }, [funkoActual]);

    const handleChangeImage = (e, index) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const newFiles = [...files];
            const newFileURLs = [...fileURLs];

            newFiles[index] = selectedFile;
            newFileURLs[index] = URL.createObjectURL(selectedFile);

            setFiles(newFiles);
            setFileURLs(newFileURLs);

            setValue(`imagenes.${index}.urlImagen`, selectedFile.name);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [categoriasRes, funkoRes] = await Promise.all([
                    CategoriaService.getCategorias(),
                    FunkoService.getFunkoById(id),
                ]);

                const categorias = categoriasRes.data.data || categoriasRes.data || [];
                const payload = funkoRes.data?.data ?? funkoRes.data;

                setDataCategorias(categorias);
                setFunkoActual(payload);

                const categoriasIds = Array.isArray(payload?.categorias)
                    ? payload.categorias.map((cat) => {
                        if (typeof cat === "number") return cat;
                        if (typeof cat === "string") {
                            const encontrada = categorias.find((c) => c.nombre === cat);
                            return encontrada ? encontrada.idCategoria : null;
                        }
                        return cat?.idCategoria ?? null;
                    }).filter(Boolean)
                    : [];

                const imagenesIniciales = Array.isArray(payload?.imagenes) && payload.imagenes.length > 0
                    ? payload.imagenes.map((img) => ({
                        urlImagen:
                            typeof img === "string"
                                ? img
                                : img?.urlImagen ?? img?.url ?? "",
                    }))
                    : payload?.imagen_portada
                        ? [{ urlImagen: payload.imagen_portada }]
                        : [{ urlImagen: "" }];

                const previewInicial = imagenesIniciales
                    .map((img) => img.urlImagen)
                    .filter(Boolean)
                    .map((name) =>
                        name.startsWith("http") ? name : `${uploadBaseUrl}${name}`
                    );

                setFileURLs(previewInicial);
                setFiles(new Array(imagenesIniciales.length).fill(null));

                reset({
                    idFunko: payload?.idFunko ?? payload?.id ?? "",
                    nombre: payload?.nombre ?? "",
                    descripcion: payload?.descripcion ?? "",
                    condicion: payload?.condicion ?? "",
                    estado: payload?.estado ?? "Activo",
                    vendedor_id: payload?.vendedor_id ?? usuarioActual.id,
                    categorias: categoriasIds,
                    imagenes: imagenesIniciales,
                });

                if (
                    Array.isArray(payload?.subastas) &&
                    payload.subastas.some(
                        (s) => String(s?.estado ?? "").toLowerCase() === "activa"
                    )
                ) {
                    setBloqueado(true);
                } else {
                    setBloqueado(false);
                }
            } catch (err) {
                console.error(err);
                setError("Error al cargar el funko para editar");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, reset, setValue, uploadBaseUrl]);

    const onSubmit = async (dataForm) => {
        if (bloqueado || tieneSubastaActiva) {
            toast.error("No se puede editar este funko porque tiene una subasta activa");
            return;
        }

        try {
            const nombresImagenes = dataForm.imagenes
                .map((img, index) => {
                    if (files[index]) return files[index].name;
                    return img?.urlImagen ?? "";
                })
                .filter(Boolean);

            if (nombresImagenes.length === 0) {
                toast.error("Debes seleccionar al menos una imagen para el funko");
                return;
            }

            const payload = {
                idFunko: Number(dataForm.idFunko),
                nombre: dataForm.nombre,
                descripcion: dataForm.descripcion,
                condicion: dataForm.condicion,
                estado: funkoActual?.estado ?? "Activo",
                categorias: dataForm.categorias,
                imagenes: nombresImagenes,
            };

            const response = await FunkoService.updateFunko(payload);

            const idFunko =
                response.data?.data?.idFunko ||
                response.data?.data?.id ||
                response.data?.idFunko ||
                response.data?.id ||
                payload.idFunko;

            // subir solo las imágenes nuevas seleccionadas
            const nuevosArchivos = files.filter(Boolean);
            for (const file of nuevosArchivos) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("funko_id", idFunko);
                await ImageService.createImage(formData);
            }

            toast.success("Funko actualizado correctamente", { duration: 3000 });
            navigate("/funkos");
        } catch (err) {
            console.error(err);
            setError("Error al actualizar funko");
        }
    };

    if (loading) return <p className="text-white p-6">Cargando...</p>;
    if (error) return <p className="text-red-600 p-6">{error}</p>;

    return (
        <Card className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Actualizar Funko</h2>

            {bloqueado && (
                <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-amber-300">
                    Este funko no se puede editar porque tiene una subasta activa.
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FunkoForm
                    control={control}
                    errors={errors}
                    dataCategorias={dataCategorias}
                    usuarioActual={usuarioActual}
                    fileURLs={fileURLs}
                    onChangeImage={handleChangeImage}
                />

                <div className="flex justify-between gap-4 mt-6">
                    <Button
                        type="button"
                        variant="default"
                        className="flex items-center gap-2 bg-accent text-white"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Regresar
                    </Button>

                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={bloqueado}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Guardar cambios
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default FunkoUpdate;