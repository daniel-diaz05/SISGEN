<?php
/**
 * Endpoint: /uploads/solicitudes_crear.php
 * Método: POST
 * Descripción: Crea una nueva solicitud con productos asociados.
 * Entrada: JSON items:[{producto_id, cantidad},...]
 * Respuesta: JSON: éxito o error.
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/conexion.php';
error_reporting(E_ERROR | E_PARSE);

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['items']) || !is_array($data['items'])) {
    http_response_code(400);
    echo json_encode(["ok"=>false,"msg"=>"Datos inválidos"]);
    exit;
}

// solicitante
$solicitante = "cliente1";

try {
    $stmt = $conn->prepare("INSERT INTO solicitudes (solicitante, estado) VALUES (?, 'pendiente')");
    $stmt->bind_param("s", $solicitante);
    if (!$stmt->execute()) {
        throw new Exception("Error al crear solicitud");
    }
    $solicitud_id = $stmt->insert_id;

    $stmt2 = $conn->prepare("INSERT INTO solicitud_items (solicitud_id, producto_id, cantidad) VALUES (?,?,?)");
    foreach ($data['items'] as $item) {
        $producto_id = (int)($item['producto_id'] ?? 0);
        $cantidad    = (int)($item['cantidad'] ?? 0);
        if ($producto_id > 0 && $cantidad > 0) {
            $stmt2->bind_param("iii", $solicitud_id, $producto_id, $cantidad);
            $stmt2->execute();
        }
    }

    echo json_encode(["ok"=>true,"msg"=>"Solicitud creada con éxito","id"=>$solicitud_id]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["ok"=>false,"msg"=>$e->getMessage()]);
}
