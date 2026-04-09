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






    
    private function getPujaMayor($idSubasta)
    {
        $sql = "SELECT usuarioId, monto
            FROM Puja
            WHERE subastaId = $idSubasta
            ORDER BY monto DESC, fechaYhora ASC
            LIMIT 1;";
        $r = $this->enlace->ExecuteSQL($sql);
        return (!empty($r)) ? $r[0] : null;
    }
    private function getSubasta($idSubasta)
    {
        $sql = "SELECT s.idsubasta, s.funko_id, s.precioBase, s.incre_minimo, s.estado, f.vendedor_id
            FROM subasta s
            INNER JOIN Funko f ON s.funko_id = f.idFunko
            WHERE s.idsubasta = $idSubasta
            LIMIT 1;";
        $r = $this->enlace->ExecuteSQL($sql);
        return (!empty($r)) ? $r[0] : null;
    }



    public function create($objeto)
    {
        $resultadoModel = new ResultadoSubastaModel();

        // 1. Primero evaluar cierre automático
        $resultadoModel->cerrarSubasta($objeto->subastaId);

        // 2. Traer subasta actualizada
        $subasta = $this->getSubasta($objeto->subastaId);

        if (!$subasta) {
            throw new Exception("Subasta no encontrada");
        }

        // 3. Impedir nuevas pujas si ya cerró o fue cancelada
        if ($subasta->estado === "FINALIZADA" || $subasta->estado === "CANCELADA") {
            throw new Exception("No se puede pujar, la subasta ya finalizó");
        }

        // 4. Validar que esté activa
        if ($subasta->estado !== "ACTIVA") {
            throw new Exception("Solo se puede pujar en subastas activas");
        }

        // 5. Variable lógica de usuario actual
        $usuarioActualId = $objeto->usuarioId;

        // 6. El vendedor no puede pujar
        if ((int)$usuarioActualId === (int)$subasta->vendedor_id) {
            throw new Exception("El vendedor no puede pujar en su propia subasta");
        }

        // 7. Obtener puja actual más alta
        $pujaMayor = $this->getPujaMayor($objeto->subastaId);

        if ($pujaMayor) {
            $montoMinimoPermitido = $pujaMayor->monto + $subasta->incre_minimo;

            if ($objeto->monto < $montoMinimoPermitido) {
                throw new Exception("La puja debe ser mayor a la actual y respetar el incremento mínimo");
            }
        } else {
            if ($objeto->monto < $subasta->precioBase) {
                throw new Exception("La primera puja debe ser igual o mayor al precio base");
            }
        }

        // 8. Insertar puja
        $sql = "INSERT INTO Puja (subastaId, usuarioId, monto, fechaYhora)
            VALUES ($objeto->subastaId, $usuarioActualId, $objeto->monto, NOW());";

        $id = $this->enlace->executeSQL_DML_last($sql);

        // 9. Retornar la puja creada
        $sql = "SELECT p.idPuja, p.subastaId, p.usuarioId, p.monto, p.fechaYhora
            FROM Puja p
            WHERE p.idPuja = $id
            LIMIT 1;";

        $r = $this->enlace->ExecuteSQL($sql);
        return (!empty($r)) ? $r[0] : null;
    }
    
}
