<?php
/**
 * Endpoint: /uploads/usuarios_listar.php
 * Método: GET
 * Descripción: Lista todos los usuarios del sistema.
 * Respuesta: JSON: [ { id, nombre, email, rol } ]
 */

require_once __DIR__ . "/../middleware/validar_sesion.php";
require_once __DIR__ . "/../../config/conexion.php";

header("Content-Type: application/json; charset=utf-8");

error_reporting(E_ALL);
ini_set('display_errors', 1);

$sql = "SELECT id, nombre, email, rol FROM usuarios ORDER BY id ASC";
$res = $conn->query($sql);

if (!$res) {
    echo json_encode(["ok" => false, "error" => $conn->error]);
    exit;
}

$usuarios = [];
while ($row = $res->fetch_assoc()) {
    $usuarios[] = $row;
}

echo json_encode($usuarios);

