<?php
class PujaModel{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all(){
        $sql = "SELECT p.idPuja, p.subastaId, CONCAT(u.nombre,' ',u.apellido) AS usuario, p.monto, p.fechaYhora
                FROM Puja p INNER JOIN Usuario u ON p.usuarioId = u.id ORDER BY p.fechaYhora DESC;";

        return $this->enlace->ExecuteSQL($sql);
    }

    //pujas por subasta
    public function getBySubasta($idSubasta){
        $sql = "SELECT p.idPuja, CONCAT(u.nombre,' ',u.apellido) AS usuario, p.monto, p.fechaYhora
                FROM Puja p INNER JOIN Usuario u ON p.usuarioId = u.id WHERE p.subastaId = $idSubasta ORDER BY p.fechaYhora DESC;";

        return $this->enlace->ExecuteSQL($sql);
    }

    //pujas por usuario
    public function getByUsuario($idUsuario){
        $sql = "SELECT p.idPuja, p.subastaId, p.monto, p.fechaYhora FROM Puja p WHERE p.usuarioId = $idUsuario ORDER BY p.fechaYhora DESC;";

        return $this->enlace->ExecuteSQL($sql);
    }


    
}
