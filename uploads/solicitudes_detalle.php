<?php
/**
 * Endpoint: /uploads/solicitudes_detalle.php
 * Método: GET
 * Descripción: Obtiene el detalle de una solicitud específica
 * Entrada: query param ?id={id}
 * Respuesta: JSON: detalle de la solicitud.
 */
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/../config/conexion.php';

$id = $_GET['id'] ?? 0;
$id = (int)$id;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["ok"=>false, "msg"=>"ID inválido"]);
    exit;
}

$sql = "SELECT si.producto_id, si.cantidad, p.producto
        FROM solicitud_items si
        INNER JOIN productos p ON si.producto_id = p.id
        WHERE si.solicitud_id = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["ok"=>false, "msg"=>"Error en prepare: ".$conn->error]);
    exit;
}

$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

$items = [];
while ($row = $res->fetch_assoc()) {
    $items[] = $row;
}

echo json_encode($items);
