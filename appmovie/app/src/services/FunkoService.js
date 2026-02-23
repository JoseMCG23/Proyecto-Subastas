import axios from "axios";

// http://localhost:81/appmovie/api/funko
const BASE_URL = import.meta.env.VITE_BASE_URL + "funko";

class FunkoService {
    // Listado
    getFunkos() {
        return axios.get(BASE_URL);
    }

    // Detalle
    getFunkoById(idFunko) {
        return axios.get(BASE_URL + "/" + idFunko);
    }
}

export default new FunkoService();