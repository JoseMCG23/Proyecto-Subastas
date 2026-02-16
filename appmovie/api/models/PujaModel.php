<?php
class PujaModel{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

}
