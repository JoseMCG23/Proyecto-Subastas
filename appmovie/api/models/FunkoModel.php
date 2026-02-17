<?php
class FunkoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

   
    private function getNombreDueno($idUsuario)
    {
        $sql = "SELECT nombre, apellido FROM Usuario WHERE id=$idUsuario;";
        $r = $this->enlace->executeSQL($sql);
        if (!empty($r)) return $r[0]->nombre . " " . $r[0]->apellido;
        return null;
    }

    /**
     * LISTADOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
     * nombre, imagen_portada, categorias, dueno
     */
    public function all()
    {
        $catM = new FunkoCategoriaModel();

        $sql = "SELECT idFunko, nombre, imagen_portada, vendedor_id
                FROM Funko
                ORDER BY idFunko DESC;";
        $r = $this->enlace->ExecuteSQL($sql);

        if (!empty($r) && is_array($r)) {
            for ($i = 0; $i < count($r); $i++) {
                $r[$i]->categorias = $catM->getCategoriasFunko($r[$i]->idFunko);
                $r[$i]->dueno = $this->getNombreDueno($r[$i]->vendedor_id);

                // olo lo necesario
                unset($r[$i]->vendedor_id);
            }
        }
        return $r;
    }

    /**
     * DETALLEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
     */
    public function get($id)
    {
        $catM = new FunkoCategoriaModel();
        $imgM = new FunkoImagenModel();

        $sql = "SELECT idFunko, nombre, descripcion, estado, condicion, fecha_registro, vendedor_id, imagen_portada
                FROM Funko
                WHERE idFunko=$id;";
        $r = $this->enlace->executeSQL($sql);

        if (!empty($r)) {
            $f = $r[0];

            $f->categorias = $catM->getCategoriasFunko($f->idFunko);
            $f->imagenes   = $imgM->getImagenesFunko($f->idFunko);
            $f->propietario = $this->getNombreDueno($f->vendedor_id);

           
            $sqlSub = "SELECT idsubasta, fechaInicio, fechafin, estado
                       FROM subasta
                       WHERE funko_id=$id
                       ORDER BY fechaInicio DESC;";
            $subs = $this->enlace->executeSQL($sqlSub);
            $f->subastas = (!empty($subs) && is_array($subs)) ? $subs : [];

            unset($f->vendedor_id);
            return $f;
        }
        return null;
    }
}
