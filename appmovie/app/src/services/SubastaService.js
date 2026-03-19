import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "subasta";

class SubastaService {

    getSubastas() {
        return axios.get(BASE_URL);
    }

    getSubastasActivas() {
        return axios.get(`${BASE_URL}/activas`);
    }

    getSubastasFinalizadas() {
        return axios.get(`${BASE_URL}/finalizadas`);
    }

    getSubastaById(idSubasta) {
        return axios.get(`${BASE_URL}/${idSubasta}`);
    }

    getPujasBySubasta(idSubasta) {
        return axios.get(`${BASE_URL}/pujas/${idSubasta}`);
    }



    // Crear
    createSubasta(subasta) {
        return axios.post(BASE_URL, JSON.stringify(subasta));
    }
// Actualizar
    updateSubasta(subasta) {
        return axios.put(BASE_URL, JSON.stringify(subasta));
    }

    publicarSubasta(idSubasta) {
        return axios.post(`${BASE_URL}/publicar/${idSubasta}`);
    }

    cancelarSubasta(idSubasta) {
    return axios.post(`${BASE_URL}/cancelar/${idSubasta}`);
    }
    
}

export default new SubastaService();