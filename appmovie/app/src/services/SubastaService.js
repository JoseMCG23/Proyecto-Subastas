import axios from "axios";

// http://localhost:81/appmovie/api/subasta
const BASE_URL = import.meta.env.VITE_BASE_URL + "subasta";

class SubastaService {
    // Listado
    getSubastas() {
        return axios.get(BASE_URL);
    }

    //Subastas activas
    getSubastasActivas() {
        return axios.get(BASE_URL + "/activas");
    }

    // Subastas finalizadas
    getSubastasFinalizadas() {
        return axios.get(BASE_URL + "/finalizadas");
    }

    // Detalle
    getSubastaById(idSubasta) {
        return axios.get(BASE_URL + "/" + idSubasta);
    }

    // Historial de pujas
    getPujasBySubasta(idSubasta) {
    return axios.get(BASE_URL + "/pujas/" + idSubasta);
}
}

export default new SubastaService();