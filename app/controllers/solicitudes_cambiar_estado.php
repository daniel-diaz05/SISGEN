<?php
/**
 * Endpoint: /uploads/solicitudes_cambiar_estado.php
 * Método: POST
 * Descripción: Cambia el estado de una solicitud (aprobar o rechazar)
 * Entrada: JSON { id, accion:"aprobar"o"rechazar" }
 * Respuesta: JSON: éxito o error.
 */

require_once __DIR__ . '/../middleware/validar_sesion.php';
require_once __DIR__ . '/../../config/conexion.php';

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
$estado = $accion === "aprobar" ? "aprobada" : "rechazada";
$stmt = $conn->prepare("UPDATE solicitudes SET estado=? WHERE id=?");
$stmt->bind_param("si", $estado, $id);
$stmt->execute();

if ($stmt->affected_rows < 1) {
    echo json_encode(["ok"=>false,"msg"=>"No se actualizó ninguna fila. Verifica el id."]);
    exit;
}

if ($accion === "aprobar") {
    // Traer items de solicitud
    $items = $conn->query("SELECT * FROM solicitud_items WHERE solicitud_id=".$id);
    while ($item = $items->fetch_assoc()) {
        $producto_id = $item['producto_id'];
        $cantidad    = $item['cantidad'];

        // Validar stock disponible antes de aprobar
        $stmtCheck = $conn->prepare("SELECT stock FROM productos WHERE id = ?");
        $stmtCheck->bind_param("i", $producto_id);
        $stmtCheck->execute();
        $stmtCheck->bind_result($stock_actual);
        $stmtCheck->fetch();
        $stmtCheck->close();

        if ($stock_actual === null) {
            http_response_code(400);
            echo json_encode([
                "ok"  => false,
                "msg" => "Producto ID $producto_id no existe"
            ]);
            exit;
        }

        if ($cantidad > $stock_actual) {
            http_response_code(400);
            echo json_encode([
                "ok"  => false,
                "msg" => "Stock insuficiente para el producto ID $producto_id"
            ]);
            exit;
        }

        // Insertar movimiento salida
        $stmt2 = $conn->prepare("INSERT INTO movimientos (producto_id, tipo, cantidad, motivo) VALUES (?, 'salida', ?, 'compra aprobada')");
        $stmt2->bind_param("ii", $producto_id, $cantidad);
        $stmt2->execute();

        // Actualizar stock en productos
        $stmt3 = $conn->prepare("UPDATE productos SET stock = stock - ? WHERE id=?");
        $stmt3->bind_param("ii", $cantidad, $producto_id);
        $stmt3->execute();
    }

        // Actualizar la fecha de última actualización del inventario
        $conn->query("UPDATE inventario_meta SET ultima_actualizacion = NOW() WHERE id = 1");

}

echo json_encode(["ok"=>true,"msg"=>"Solicitud $estado correctamente"]);
