//// cris no de la profe 

import axios from "axios";

// 
// http://localhost:81/appmovie/api/usuario
const BASE_URL = import.meta.env.VITE_BASE_URL + "usuario";

class UsuarioService {
    // Listado de usuarios
    // GET http://localhost:81/appmovie/api/usuario
    getUsuarios() {
        return axios.get(BASE_URL);
    }

    // Detalle de usuario
    // GET http://localhost:81/appmovie/api/usuario/1
    getUsuarioById(idUsuario) {
        return axios.get(BASE_URL + "/" + idUsuario);
    }
}

export default new UsuarioService();