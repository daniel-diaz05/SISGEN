<?php
/**
 * Endpoint: /uploads/solicitudes_listar.php
 * Método: GET
 * Descripción: Lista todas las solicitudes de productos.
 * Respuesta: JSON: { id, usuario, estado, ... }
 */
require_once __DIR__ . '/../config/conexion.php';
header("Content-Type: application/json");
error_reporting(0);

$sql = "
SELECT 
  s.id,
  s.solicitante,
  s.motivo,
  s.estado,
  s.fecha,
  COUNT(si.id) AS items,
  COALESCE(SUM(si.cantidad), 0) AS total_unidades
FROM solicitudes s
LEFT JOIN solicitud_items si ON si.solicitud_id = s.id
GROUP BY s.id
ORDER BY s.fecha DESC, s.id DESC
";

$res = $conn->query($sql);

$solicitudes = [];
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $solicitudes[] = $row;
    }
}

echo json_encode($solicitudes);