<?php
class puja
{
    public function index(){
        $model = new PujaModel();
        echo json_encode($model->all());
    }

    public function getBySubasta($id){
        $model = new PujaModel();
        echo json_encode($model->getBySubasta($id));
    }

    public function getByUsuario($id){
        $model = new PujaModel();
        echo json_encode($model->getByUsuario($id));
    }

    

    
}