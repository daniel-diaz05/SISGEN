<?php
/**
 * Endpoint: /uploads/solicitudes_cambiar_estado.php
 * Método: POST
 * Descripción: Cambia el estado de una solicitud (aprobar o rechazar)
 * Entrada: JSON { id, accion:"aprobar"o"rechazar" }
 * Respuesta: JSON: éxito o error.
 */
require_once __DIR__ . '/../config/conexion.php';

$data = json_decode(file_get_contents("php://input"), true);
$id     = $data['id'] ?? 0;
$accion = $data['accion'] ?? '';

if (!$id || !$accion) {
    http_response_code(400);
    echo json_encode(["ok"=>false,"msg"=>"Datos incompletos"]);
    exit;
}

// Validar acción
if (!in_array($accion, ["aprobar","rechazar"])) {
    http_response_code(400);
    echo json_encode(["ok"=>false,"msg"=>"Acción inválida"]);
    exit;
}

// Cambiar estado solicitud
$estado = $accion === "aprobar" ? "aprobado" : "rechazado";
$stmt = $conn->prepare("UPDATE solicitudes SET estado=? WHERE id=?");
$stmt->bind_param("si", $estado, $id);
$stmt->execute();

if ($accion === "aprobar") {
    // Traer items de solicitud
    $items = $conn->query("SELECT * FROM solicitud_items WHERE solicitud_id=".$id);
    while ($item = $items->fetch_assoc()) {
        $producto_id = $item['producto_id'];
        $cantidad    = $item['cantidad'];

        // Insertar movimiento entrada
        $stmt2 = $conn->prepare("INSERT INTO movimientos (producto_id, tipo, cantidad, motivo) VALUES (?, 'entrada', ?, 'compra aprobada')");
        $stmt2->bind_param("ii", $producto_id, $cantidad);
        $stmt2->execute();

        // Actualizar stock en productos
        $stmt3 = $conn->prepare("UPDATE productos SET stock = stock + ? WHERE id=?");
        $stmt3->bind_param("ii", $cantidad, $producto_id);
        $stmt3->execute();
    }
}

echo json_encode(["ok"=>true,"msg"=>"Solicitud $estado correctamente"]);
