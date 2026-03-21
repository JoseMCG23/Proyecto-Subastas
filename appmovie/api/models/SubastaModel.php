<?php
class SubastaModel {
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    private function getNombreUsuario($idUsuario)
    {
        $sql = "SELECT nombre, apellido FROM Usuario WHERE id=$idUsuario;";
        $r = $this->enlace->executeSQL($sql);
        if (!empty($r)) return $r[0]->nombre . " " . $r[0]->apellido;
        return null;
    }

    public function all(){

        $sql = "SELECT 
                    s.idsubasta,
                    s.funko_id,
                    f.nombre AS objeto,
                    f.imagen_portada AS imagen,
                    f.vendedor_id,
                    f.condicion,
                    s.fechaInicio,
                    s.fechafin,
                    s.precioBase,
                    s.incre_minimo,
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

        $r = $this->enlace->ExecuteSQL($sql);

        if (!empty($r) && is_array($r)) {
            for ($i = 0; $i < count($r); $i++) {
                $r[$i]->usuarioCreador = $this->getNombreUsuario($r[$i]->vendedor_id);
                // Opcionalmente quitar el vendedor_id si no se necesita
                unset($r[$i]->vendedor_id);
            }
        }

        return $r;
    }
    
    //Cantidad Pujas
    private function getCantidadPujas($idSubasta)
    {
        $sql = "SELECT COUNT(*) as total FROM Puja WHERE subastaId = $idSubasta;";
        $r = $this->enlace->ExecuteSQL($sql);
        return (!empty($r)) ? $r[0]->total : 0;
    }

    //Subastas activas
    public function getActivas()
    {
        $sql = "SELECT s.idsubasta, f.nombre AS objeto, f.imagen_portada AS imagen, 
                   s.fechaInicio, s.fechafin AS fechaCierreEstimada, s.precioBase
            FROM subasta s
            INNER JOIN Funko f ON s.funko_id = f.idFunko
            WHERE s.estado = 'ACTIVA'
            ORDER BY s.fechaInicio DESC;";

        $r = $this->enlace->ExecuteSQL($sql);

        if (!empty($r) && is_array($r)) {
            foreach ($r as $item) {
                $item->cantidadPujas = $this->getCantidadPujas($item->idsubasta);
            }
        }

        return $r ?: [];
    }

    //Subastas finalizadas
    public function getFinalizadas()
    {
        $sql = "SELECT s.idsubasta, f.nombre AS objeto, f.imagen_portada AS imagen,
                   s.fechafin AS fechaCierre, s.estado AS estadoFinal, s.precioBase
            FROM subasta s
            INNER JOIN Funko f ON s.funko_id = f.idFunko
            WHERE s.estado IN ('FINALIZADA','CANCELADA')
            ORDER BY s.fechafin DESC;";

        $r = $this->enlace->ExecuteSQL($sql);

        if (!empty($r) && is_array($r)) {
            foreach ($r as $item) {
                $item->cantidadPujas = $this->getCantidadPujas($item->idsubasta);
            }
        }

        return $r ?: [];
    }

    //Detalle de una subasta en especifico
    public function get($id){
        $sql = "SELECT s.idsubasta, s.funko_id, s.fechaInicio, s.fechafin, s.precioBase, s.incre_minimo, s.estado, f.nombre, f.imagen_portada, f.condicion, f.idFunko
                FROM subasta s INNER JOIN Funko f ON s.funko_id = f.idFunko WHERE s.idsubasta = $id;";
        $r = $this->enlace->ExecuteSQL($sql);
        if (!empty($r)) {
            $subasta = $r[0];
            $subasta->cantidadTotalPujas = $this->getCantidadPujas($id);
            $subasta->categorias = $this->getCategoriasFunko($subasta->idFunko);

            // Asegurar funko_id para compatibilidad con el formulario de edición
            if (isset($subasta->idFunko) && !isset($subasta->funko_id)) {
                $subasta->funko_id = $subasta->idFunko;
            }

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

    //Crear subasta
    public function create($objeto)
    {
        // Fecha cierre > fecha inicio
        if (strtotime($objeto->fechafin) <= strtotime($objeto->fechaInicio)) {
            throw new Exception("La fecha de cierre debe ser mayor a la de inicio");
        }

        //Precio base > 0
        if ($objeto->precioBase <= 0) {
            throw new Exception("El precio base debe ser mayor a 0");
        }

        //Incremento mínimo > 0
        if ($objeto->incre_minimo <= 0) {
            throw new Exception("El incremento mínimo debe ser mayor a 0");
        }

        
        //El objeto (funko)no puede tener otra subasta activa
        $sql = "SELECT idsubasta FROM subasta 
                WHERE funko_id = $objeto->funko_id 
                AND estado = 'ACTIVA';";
        $r = $this->enlace->executeSQL($sql);

        if (!empty($r)) {
            throw new Exception("El funko ya tiene una subasta activa");
        }

        // El objeto (funko) debe estar activo
        $sql = "SELECT estado FROM Funko WHERE idFunko = $objeto->funko_id;";
        $r = $this->enlace->executeSQL($sql);

        if (empty($r) || $r[0]->estado != 'DISPONIBLE') {
            throw new Exception("El funko no está disponible");
        }

        // Insert
        $sql = "INSERT INTO subasta 
                (funko_id, fechaInicio, fechafin, precioBase, incre_minimo, estado)
                VALUES (
                    $objeto->funko_id,
                    '$objeto->fechaInicio',
                    '$objeto->fechafin',
                    $objeto->precioBase,
                    $objeto->incre_minimo,
                    'INACTIVA'
                );";

        $id = $this->enlace->executeSQL_DML_last($sql);

        return $this->get($id);
    }

    private function tienePujas($idSubasta)
    {
        $sql = "SELECT COUNT(*) as total FROM Puja WHERE subastaId = $idSubasta;";
        $r = $this->enlace->executeSQL($sql);
        return (!empty($r) && $r[0]->total > 0);
    }

    //Actualizar subasta
    public function update($objeto)
    {
        $id = $objeto->idsubasta;
        $sql = "SELECT fechaInicio FROM subasta WHERE idsubasta = $id;";
        $r = $this->enlace->executeSQL($sql);

        if (empty($r)) {
            throw new Exception("Subasta no encontrada");
        }

        $fechaInicio = $r[0]->fechaInicio;

        // Validar si no ha iniciado
        if (strtotime($fechaInicio) <= time()) {
            throw new Exception("No se puede editar porque la subasta ya inició");
        }

        // Validar si no tiene pujas
        if ($this->tienePujas($id)) {
            throw new Exception("No se puede editar porque ya tiene pujas");
        }

        // Fecha cierre > fecha inicio
        if (strtotime($objeto->fechafin) <= strtotime($objeto->fechaInicio)) {
            throw new Exception("La fecha de cierre debe ser mayor a la de inicio");
        }

        //Precio base > 0
        if ($objeto->precioBase <= 0) {
            throw new Exception("Precio base inválido");
        }

        //Incremento mínimo > 0
        if ($objeto->incre_minimo <= 0) {
            throw new Exception("Incremento mínimo inválido");
        }

        // Update
        $sql = "UPDATE subasta SET
                    fechaInicio = '$objeto->fechaInicio',
                    fechafin = '$objeto->fechafin',
                    precioBase = $objeto->precioBase,
                    incre_minimo = $objeto->incre_minimo
                WHERE idsubasta = $id;";

        $this->enlace->executeSQL_DML($sql);

        return $this->get($id);
    }

    //Publicar subasta
    public function publicar($id)
    {
        $sql = "SELECT estado FROM subasta WHERE idsubasta = $id;";
        $r = $this->enlace->executeSQL($sql);

        if (empty($r)) {
            throw new Exception("Subasta no encontrada");
        }

        // Solo publicar subasta INACTIVA (subasta creada lista para programar)
        if ($r[0]->estado != 'INACTIVA') {
            throw new Exception("Solo se pueden publicar subastas INACTIVAS");
        }

        // Cambia a PROGRAMADA (lista para iniciar)
        $sql = "UPDATE subasta SET estado = 'PROGRAMADA' WHERE idsubasta = $id;";
        $this->enlace->executeSQL_DML($sql);

        return $this->get($id);
    }

    //Cancelar subasta
    public function cancelar($id)
    {
        $sql = "SELECT fechaInicio FROM subasta WHERE idsubasta = $id;";
        $r = $this->enlace->executeSQL($sql);

        if (empty($r)) {
            throw new Exception("Subasta no encontrada");
        }

        // Verificar si no ha iniciado o no tiene pujas
        if (strtotime($r[0]->fechaInicio) > time() || !$this->tienePujas($id)) {

            $sql = "UPDATE subasta SET estado = 'CANCELADA' WHERE idsubasta = $id;";
            $this->enlace->executeSQL_DML($sql);

            return $this->get($id);
        }

        throw new Exception("No se puede cancelar la subasta");
    }
}
