import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
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

export function FunkoCreate() {
    const navigate = useNavigate();

    const [dataCategorias, setDataCategorias] = useState([]);
    const [files, setFiles] = useState([]);
    const [fileURLs, setFileURLs] = useState([]);
    const [error, setError] = useState("");

    const funkoSchema = yup.object({
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
    } = useForm({
        defaultValues: {
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
        const fechData = async () => {
            try {
                const categoriasRes = await CategoriaService.getCategorias();
                setDataCategorias(categoriasRes.data.data || []);
            } catch (error) {
                console.log(error);
                if (error.name != "AbortError") setError(error.message);
            }
        };
        fechData();
    }, []);

    const onSubmit = async (dataForm) => {
        const validFiles = files.filter((item) => item);

        if (validFiles.length === 0) {
            toast.error("Debes seleccionar al menos una imagen para el funko");
            return;
        }

        try {
            const formDataFunko = {
                nombre: dataForm.nombre,
                descripcion: dataForm.descripcion,
                condicion: dataForm.condicion,
                estado: "Activo",
                vendedor_id: usuarioActual.id,
                categorias: dataForm.categorias,
                imagenes: validFiles.map((file) => file.name),
            };

            const response = await FunkoService.createFunko(formDataFunko);

            if (response.data) {
                const idFunko =
                    response.data.data?.idFunko ||
                    response.data.data?.id ||
                    response.data.idFunko ||
                    response.data.id;

              
                 for (const file of validFiles) {
                     const formData = new FormData();
                   formData.append("file", file);
                     formData.append("funko_id", idFunko);
                    await ImageService.createImage(formData);
                 }

                toast.success(
                    `Funko creado ${idFunko} - ${response.data.data?.nombre || response.data.nombre}`,
                    { duration: 3000 }
                );

                navigate("/funkos");
            } else if (response.error) {
                setError(response.error);
            }
        } catch (err) {
            console.error(err);
            setError("Error al crear funko");
        }
    };

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <Card className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Crear Funko</h2>

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

                    <Button type="submit" className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default FunkoCreate;