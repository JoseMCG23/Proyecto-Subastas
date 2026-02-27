<?php
class SubastaModel {
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all(){

        $sql = "SELECT 
                    s.idsubasta,
                    f.nombre AS objeto,
                    f.imagen_portada AS imagen,
                    f.condicion,
                    s.fechaInicio,
                    s.fechafin,
                    s.precioBase,
                    s.estado,
                    COUNT(DISTINCT p.idPuja) AS cantidadPujas,
                    GROUP_CONCAT(DISTINCT c.nombre SEPARATOR ', ') AS categorias
                FROM subasta s
                INNER JOIN Funko f ON s.funko_id = f.idFunko
                LEFT JOIN Puja p ON p.subastaId = s.idsubasta
                LEFT JOIN funko_categoria fc ON fc.funko_id = f.idFunko
                LEFT JOIN Categoria c ON c.idCategoria = fc.categoria_id
                GROUP BY s.idsubasta
                ORDER BY s.idsubasta DESC;";

        return $this->enlace->ExecuteSQL($sql);
    }
    
    //Cantidad Pujas
    private function getCantidadPujas($idSubasta)
    {
        $sql = "SELECT COUNT(*) as total FROM Puja WHERE subastaId = $idSubasta;";
        $r = $this->enlace->ExecuteSQL($sql);
        return (!empty($r)) ? $r[0]->total : 0;
    }

    //Subastas activas
    public function getActivas(){
        $sql = "SELECT s.idsubasta, f.nombre AS objeto, f.imagen_portada AS imagen, s.fechaInicio, s.fechafin AS fechaCierreEstimada, s.precioBase
                FROM subasta s INNER JOIN Funko f ON s.funko_id = f.idFunko WHERE s.estado = 'ACTIVA' ORDER BY s.fechaInicio DESC;";

        $r = $this->enlace->ExecuteSQL($sql);

        if (!empty($r)) {
            foreach ($r as $item) {
                $item->cantidadPujas = $this->getCantidadPujas($item->idsubasta);
            }
        }
        return $r;
    }

    //Subastas finalizadas
    public function getFinalizadas(){
        $sql = "SELECT s.idsubasta, f.nombre AS objeto, f.imagen_portada AS imagen, s.fechafin AS fechaCierre, s.estado AS estadoFinal, s.precioBase
                FROM subasta s INNER JOIN Funko f ON s.funko_id = f.idFunko WHERE s.estado IN ('FINALIZADA','CANCELADA') ORDER BY s.fechafin DESC;";

        $r = $this->enlace->ExecuteSQL($sql);
        if (!empty($r)) {
            foreach ($r as $item) {
                $item->cantidadPujas = $this->getCantidadPujas($item->idsubasta);
            }
        }
        return $r;
    }

    //Detalle de la subasta
    public function get($id){
        $sql = "SELECT s.idsubasta, s.fechaInicio, s.fechafin, s.precioBase, s.incre_minimo, s.estado, f.nombre, f.imagen_portada, f.condicion, f.idFunko
                FROM subasta s INNER JOIN Funko f ON s.funko_id = f.idFunko WHERE s.idsubasta = $id;";
        $r = $this->enlace->ExecuteSQL($sql);
        if (!empty($r)) {
            $subasta = $r[0];
            $subasta->cantidadTotalPujas = $this->getCantidadPujas($id);
            $subasta->categorias = $this->getCategoriasFunko($subasta->idFunko);
            unset($subasta->idFunko);

            return $subasta;
        }

        return null;
    }

    //Historial pujas de una subasta
    public function getPujas($idSubasta){
        $sql = "SELECT CONCAT(u.nombre,' ',u.apellido) AS usuario, p.monto, p.fechaYhora
                FROM Puja p INNER JOIN Usuario u ON p.usuarioId = u.id WHERE p.subastaId = $idSubasta ORDER BY p.fechaYhora DESC;";
        return $this->enlace->ExecuteSQL($sql);
    }

    //Categorias del funko
    private function getCategoriasFunko($idFunko){
        $sql = "SELECT c.nombre FROM Categoria c INNER JOIN funko_categoria fc ON c.idCategoria = fc.categoria_id
                WHERE fc.funko_id = $idFunko;";
        return $this->enlace->ExecuteSQL($sql);
    }
}
