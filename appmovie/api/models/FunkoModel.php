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
     * LISTADO
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
     * DETALLE
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

    /**
     * Crear funko
     * @param $objeto funko a insertar
     * @return $this->get($idFunko) - Objeto funko
     */
    //
    public function create($objeto)
    {
        //Primera imagen como portada
        $imagenPortada = $objeto->imagenes[0];

        //Consulta sql
        //Identificador autoincrementable
        $sql = "Insert into Funko (nombre, descripcion, condicion, estado, vendedor_id, imagen_portada)" .
            " Values ('$objeto->nombre','$objeto->descripcion',
                '$objeto->condicion','$objeto->estado',$objeto->vendedor_id,'$imagenPortada')";

        //Ejecutar la consulta
        //Obtener ultimo insert
        $idFunko = $this->enlace->executeSQL_DML_last($sql);

        //--- Categorias ---
        //Crear elementos a insertar en categorias
        foreach ($objeto->categorias as $value) {
            $sql = "Insert into Funko_Categoria(funko_id,categoria_id)" .
                " Values($idFunko,$value)";
            $vResultadoCat = $this->enlace->executeSQL_DML($sql);
        }

        //--- Imagenes ---
        //Crear elementos a insertar en imagenes
        foreach ($objeto->imagenes as $item) {
            $sql = "Insert into Funko_Imagen(funko_id,urlImagen)" .
                " Values($idFunko,'$item')";
            $vResultadoImg = $this->enlace->executeSQL_DML($sql);
        }

        //Retornar funko
        return $this->get($idFunko);
    }
}
