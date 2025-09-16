<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/conexion.php';
require_once __DIR__ . '/../models/Producto.php';

$producto = new Producto($conn);
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

switch ($method) {
    case 'GET':
        // Listar productos
        $productos = $producto->listar();
        echo json_encode($productos);
        break;

    case 'POST':
        // Crear producto
        if ($action === 'crear') {
            $data = json_decode(file_get_contents("php://input"), true);

            $producto->producto       = $data['producto'] ?? '';
            $producto->descripcion    = $data['descripcion'] ?? '';
            $producto->categoria      = $data['categoria'] ?? '';
            $producto->stock          = $data['stock'] ?? 0;
            $producto->codigo         = $data['codigo'] ?? '';
            $producto->precio_compra  = $data['precio_compra'] ?? 0;
            $producto->precio_venta   = $data['precio_venta'] ?? 0;
            $producto->imagen         = $data['imagen'] ?? '';

            if ($producto->crear()) {
                echo json_encode(["ok" => true, "msg" => "Producto creado"]);
            } else {
                http_response_code(500);
                echo json_encode(["ok" => false, "msg" => "Error al crear producto"]);
            }
        }
        break;

    case 'PUT':
        // Actualizar producto
        $data = json_decode(file_get_contents("php://input"), true);

        $producto->id             = $data['id'] ?? 0;
        $producto->producto       = $data['producto'] ?? '';
        $producto->descripcion    = $data['descripcion'] ?? '';
        $producto->categoria      = $data['categoria'] ?? '';
        $producto->stock          = $data['stock'] ?? 0;
        $producto->codigo         = $data['codigo'] ?? '';
        $producto->precio_compra  = $data['precio_compra'] ?? 0;
        $producto->precio_venta   = $data['precio_venta'] ?? 0;
        $producto->imagen         = $data['imagen'] ?? '';

        if ($producto->actualizar()) {
            echo json_encode(["ok" => true, "msg" => "Producto actualizado"]);
        } else {
            http_response_code(500);
            echo json_encode(["ok" => false, "msg" => "Error al actualizar producto"]);
        }
        break;

    case 'DELETE':
        // Eliminar producto
        $data = json_decode(file_get_contents("php://input"), true);
        $producto->id = $data['id'] ?? 0;

        if ($producto->eliminar()) {
            echo json_encode(["ok" => true, "msg" => "Producto eliminado"]);
        } else {
            http_response_code(500);
            echo json_encode(["ok" => false, "msg" => "Error al eliminar producto"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["ok" => false, "msg" => "Método no permitido"]);
}
