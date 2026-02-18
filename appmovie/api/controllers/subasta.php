<?php
class subasta
{
    public function index(){
        try {
            $response = new Response();
            $m = new SubastaModel();
            $result = $m->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id){
        try {
            $response = new Response();
            $m = new SubastaModel();
            $result = $m->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function activas(){
        try {
            $response = new Response();
            $m = new SubastaModel();
            $result = $m->getActivas();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function finalizadas(){
        try {
            $response = new Response();
            $m = new SubastaModel();
            $result = $m->getFinalizadas();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function pujas($id){
        try {
            $response = new Response();
            $m = new SubastaModel();
            $result = $m->getPujas($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}