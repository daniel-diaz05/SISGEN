<?php
/**
 * Endpoint: /app/controllers/login.php
 * Método: POST
 * Descripción: Autentica usuario con email y contraseña.
 * Respuesta: JSON, da éxito o error con token/sesión.
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conexion = new mysqli("localhost", "root", "", "sisgen");

$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

// Buscar usuario por email
$result = $conexion->query("SELECT * FROM usuarios WHERE email='$email' LIMIT 1");

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verificar hash contra
    if (password_verify($password, $user["password"])) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Usuario no encontrado"]);
}
if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión"]);
    exit;
}