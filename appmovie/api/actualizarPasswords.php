<?php
$config = require_once __DIR__ . '/config.php';

try {
    $pdo = new PDO(
        "mysql:host={$config['DB_HOST']};dbname={$config['DB_DBNAME']};charset=utf8mb4",
        $config['DB_USERNAME'],
        $config['DB_PASSWORD']
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $usuarios = [
        "cubillogutierrezjosemario@gmail.com" => "Admin123",
        "crmelendezj@est.utn.ac.cr" => "Marco123",
        "MarcoMora@gmail.com" => "Yuli123",
        "Valeachava@gmail.com" => "Vale123",
        "abraham7930@gmail.com" => "Abraham123",
        "tamaramiranda@gmail.com" => "Tamara123"
    ];

    $stmt = $pdo->prepare("UPDATE Usuario SET contraseña = :hash WHERE correo = :correo");

    foreach ($usuarios as $correo => $clavePlano) {
        $hash = password_hash($clavePlano, PASSWORD_DEFAULT);

        $stmt->execute([
            ':hash' => $hash,
            ':correo' => $correo
        ]);

        echo "Actualizado: " . htmlspecialchars($correo) . "<br>";
    }

    echo "<br>Proceso completado.";
} catch (PDOException $e) {
    die("Error de conexión o actualización: " . $e->getMessage());
}