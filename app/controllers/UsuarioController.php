<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../middleware/validar_sesion.php';
require_once __DIR__ . '/../config/conexion.php';
require_once __DIR__ . '/../models/Usuario.php';

// Instancia del modelo
$usuario = new Usuario($conn);

// Acción según método HTTP o action
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

switch ($method) {
    case 'POST':
        // Registro
        if ($action === 'register') {
            $data = json_decode(file_get_contents("php://input"), true);
            $usuario->nombre   = $data['nombre'] ?? '';
            $usuario->email    = $data['email'] ?? '';
            $usuario->password = $data['password'] ?? '';
            $usuario->rol      = $data['rol'] ?? 'cliente';

            if ($usuario->registrar()) {
                echo json_encode(["ok" => true, "msg" => "Usuario registrado"]);
            } else {
                http_response_code(500);
                echo json_encode(["ok" => false, "msg" => "Error al registrar"]);
            }
        }
        // Login
        elseif ($action === 'login') {
            $data = json_decode(file_get_contents("php://input"), true);
            $usuario->email    = $data['email'] ?? '';
            $usuario->password = $data['password'] ?? '';

            $user = $usuario->login();
            if ($user) {
                echo json_encode(["ok" => true, "user" => $user]);
            } else {
                http_response_code(401);
                echo json_encode(["ok" => false, "msg" => "Credenciales inválidas"]);
            }
        }
        break;

    case 'GET':
        // Listar usuarios
        $users = $usuario->listar();
        echo json_encode($users);
        break;

    default:
        http_response_code(405);
        echo json_encode(["ok" => false, "msg" => "Método no permitido"]);
}
