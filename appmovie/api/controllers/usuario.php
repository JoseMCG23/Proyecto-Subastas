<?php
class usuario
{
    public function index()
    {
        try {
            $response = new Response();
            $usuarioM = new UsuarioModel();
            $result = $usuarioM->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // localhost:81/appmovie/api/usuario/1
    public function get($id)
    {
        try {
            $response = new Response();
            $m = new UsuarioModel();
            $result = $m->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
