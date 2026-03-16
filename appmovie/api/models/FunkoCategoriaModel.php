<?php
class FunkoCategoriaModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    public function all()
    {
        $sql = "SELECT idCategoria, nombre
                FROM Categoria
                ORDER BY nombre ASC;";
        return $this->enlace->executeSQL($sql);
    }

    public function get($id)
    {
        $sql = "SELECT idCategoria, nombre
                FROM Categoria
                WHERE idCategoria=$id;";
        $result = $this->enlace->executeSQL($sql);
        return (!empty($result)) ? $result[0] : null;
    }

    public function getCategoriasFunko($idFunko)
    {
        
        $sql = "SELECT nombre
                FROM Categoria
                WHERE idCategoria IN (
                    SELECT categoria_id FROM Funko_Categoria WHERE funko_id=$idFunko
                );";
        $r = $this->enlace->executeSQL($sql);

        $cats = [];
        if (!empty($r) && is_array($r)) {
            for ($i = 0; $i < count($r); $i++) {
                $cats[] = $r[$i]->nombre;
            }
        }
        return $cats;
    }


}
