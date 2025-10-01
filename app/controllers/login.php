<?php
/**
 * Endpoint: /app/controllers/login.php
 * Método: POST
 * Descripción: Autentica usuario con email y contraseña.
 * Respuesta: JSON, da éxito o error con token/sesión.  
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

error_reporting(E_ALL);
ini_set('display_errors', 1);


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conexion = new mysqli("localhost", "root", "", "sisgen");
if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error de conexión"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

// Buscar usuario por email
$sql = "SELECT id, nombre, email, password, rol FROM usuarios WHERE email=? LIMIT 1";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user["password"])) {
        echo json_encode([
            "success" => true,
            "id" => $user["id"],
            "nombre" => $user["nombre"],
            "email" => $user["email"],
            "rol" => $user["rol"]   // 👈 aquí ya sí
        ]);
    } else {
        echo json_encode(["success" => false, "error" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Usuario no encontrado"]);
}