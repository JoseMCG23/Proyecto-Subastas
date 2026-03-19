import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SubastaService from "@/services/SubastaService";
import toast from "react-hot-toast";
import { SubastaList } from "./Form/SubastaList";
import { SubastaCreate } from "./Form/SubastaCreate";
import { SubastaUpdate } from "./Form/SubastaUpdate";
import { SubastaDetail } from "./Form/SubastaDetail";

export function MantenimientoSubasta() {
    const [showCreate, setShowCreate] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedSubasta, setSelectedSubasta] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleCreate = () => {
        setShowCreate(true);
    };

    const handleEdit = (subasta) => {
        setSelectedSubasta(subasta);
        setShowUpdate(true);
    };

    const handleViewDetail = (subasta) => {
        setSelectedSubasta(subasta);
        setShowDetail(true);
    };

    const handlePublish = async (id) => {
        try {
            await SubastaService.publicarSubasta(id);
            toast.success("Subasta publicada exitosamente");
            setRefreshKey(prev => prev + 1);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Error al publicar subasta");
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas cancelar esta subasta?")) {
            return;
        }

        try {
            await SubastaService.cancelarSubasta(id);
            toast.success("Subasta cancelada exitosamente");
            setRefreshKey(prev => prev + 1);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Error al cancelar subasta");
        }
    };

    const handleCloseModals = () => {
        setShowCreate(false);
        setShowUpdate(false);
        setShowDetail(false);
        setSelectedSubasta(null);
    };

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <>
            <SubastaList
                key={refreshKey}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onViewDetail={handleViewDetail}
                onPublish={handlePublish}
                onCancel={handleCancel}
            />

            <AnimatePresence>
                {showCreate && (
                    <SubastaCreate
                        onClose={handleCloseModals}
                        onSuccess={handleSuccess}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showUpdate && selectedSubasta && (
                    <SubastaUpdate
                        subasta={selectedSubasta}
                        onClose={handleCloseModals}
                        onSuccess={handleSuccess}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDetail && selectedSubasta && (
                    <SubastaDetail
                        subasta={selectedSubasta}
                        onClose={handleCloseModals}
                        onEdit={() => {
                            setShowDetail(false);
                            setShowUpdate(true);
                        }}
                        onPublish={() => handlePublish(selectedSubasta.idSubasta)}
                        onCancel={() => handleCancel(selectedSubasta.idSubasta)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default MantenimientoSubasta;
