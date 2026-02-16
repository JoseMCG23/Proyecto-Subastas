<?php
class UsuarioModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar usuariosprueba de inicio*/
    // public function all()
    //{
    //Consulta de SQL
    //    $vSql = "Select * from usuario;";
    //Ejecutan la consulta
    //    $vResultado = $this->enlace->executeSQL($vSql);
    //Retornan el resultado de la consulta
    //return $vResultado;
    //  }

    /**
     * Listar usuarios
     * Campos: Nombre, Rol, Estado
     */
    public function all()
    {
        $rolM = new RolModel();

        $vSql = "SELECT id, nombre, apellido, estado, rol_id FROM Usuario
        ORDER BY id DESC;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {

                $vResultado[$i]->nombreCompleto =
                    $vResultado[$i]->nombre . " " . $vResultado[$i]->apellido;

                $vResultado[$i]->rol = $rolM->getNombreRol($vResultado[$i]->rol_id);

                //estado sin numero
                $vResultado[$i]->estado = ($vResultado[$i]->estado == "INACTIVO") ? "BLOQUEADO" : "ACTIVO";

                unset($vResultado[$i]->nombre, $vResultado[$i]->apellido, $vResultado[$i]->rol_id);
            }
        }

        return $vResultado;
    }

    /**
     * Detalle usuario
     * incluye: nombre completo, rol, estado, fecha registro
     * campos calculados: cantidad subastas creadas, esta queda pendienteeeeeeeee
     */
    public function get($id)
    {
        $rolM = new RolModel();

        $vSql = "SELECT id, nombre, apellido, estado, fechaRegistro, rol_id
             FROM Usuario
             WHERE id=$id;";

        $vResultado = $this->enlace->executeSQL($vSql);

        if (!empty($vResultado)) {

            $u = $vResultado[0];

            //nombre completo
            $u->nombreCompleto = $u->nombre . " " . $u->apellido;

            //rol
            $u->rol = $rolM->getNombreRol($u->rol_id);

            // =========================
            // CAMPOS CALCULADOS
            // =========================

            //cant  subastas creadas
            $sqlSubastas = "SELECT COUNT(*) as cantidad
                        FROM subasta
                        WHERE funko_id IN (
                            SELECT idFunko FROM Funko WHERE vendedor_id=$id
                        );";

            $rSub = $this->enlace->executeSQL($sqlSubastas);
            $u->cantidadSubastasCreadas = (!empty($rSub)) ? (int)$rSub[0]->cantidad : 0;

            //cant pujas realizadas
            $sqlPujas = "SELECT COUNT(*) as cantidad
                     FROM Puja
                     WHERE usuarioId=$id;";

            $rPuja = $this->enlace->executeSQL($sqlPujas);
            $u->cantidadPujasRealizadas = (!empty($rPuja)) ? (int)$rPuja[0]->cantidad : 0;

            unset($u->nombre);
            unset($u->apellido);
            unset($u->rol_id);

            return $u;
        }

        return null;
    }
}