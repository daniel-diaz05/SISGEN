<?php
/**
 * Endpoint: /app/controllers/register.php
 * Método: POST
 * Descripción: Registra un nuevo usuario en el sistema.
 * Respuesta: JSON, da éxito o error.
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conexion = new mysqli("localhost", "root", "", "sisgen");

if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$nombre = $conexion->real_escape_string($data["nombre"] ?? "");
$email = $conexion->real_escape_string($data["email"] ?? "");
$password = password_hash($data["password"] ?? "", PASSWORD_BCRYPT);

$sql = "INSERT INTO usuarios (nombre, email, password) VALUES ('$nombre', '$email', '$password')";
if ($conexion->query($sql)) {
    echo json_encode(["ok" => true]);
} else {
    http_response_code(400);
    echo json_encode(["error" => "No se pudo registrar"]);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data["email"]) || empty($data["password"])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}


?>
