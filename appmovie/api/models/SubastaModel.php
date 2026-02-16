<?php
class SubastaModel {
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

}
