<?php
// localhost:81/appmovie/api/funko
class funko
{

    public function index()
    {
        try {
            $response = new Response();
            $m = new FunkoModel();
            $result = $m->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // localhost:81/appmovie/api/funko/1
    public function get($id)
    {
        try {
            $response = new Response();
            $m = new FunkoModel();
            $result = $m->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
