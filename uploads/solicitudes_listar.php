<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/../config/conexion.php';
if (method_exists($conn, 'set_charset')) { $conn->set_charset('utf8mb4'); }

$sql = "
SELECT 
  s.id,
  s.solicitante,
  s.motivo,
  s.estado,
  s.fecha,
  COUNT(si.id)                              AS items,
  COALESCE(SUM(si.cantidad), 0)             AS total_unidades
FROM solicitudes s
LEFT JOIN solicitud_items si ON si.solicitud_id = s.id
GROUP BY 
  s.id, s.solicitante, s.motivo, s.estado, s.fecha
ORDER BY s.fecha DESC, s.id DESC
";

$r = $conn->query($sql);

if (!$r) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'DB error: '.$conn->error,
        'sql' => $sql
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$out = [];
while ($row = $r->fetch_assoc()) { $out[] = $row; }



// Log para confirmar cuantas filas devolvió
echo json_encode($out, JSON_UNESCAPED_UNICODE);
