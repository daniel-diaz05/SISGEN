<?php
// Forzar SOLO JSON en la salida
header('Content-Type: application/json; charset=utf-8');

// Apagar avisos que rompen el JSON (si quieres verlos, revisa el log de PHP)
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

// Limpiar cualquier salida previa (BOM/espacios)
while (ob_get_level()) { ob_end_clean(); }

require __DIR__ . '/../conexion.php';
if (method_exists($conn, 'set_charset')) { $conn->set_charset('utf8mb4'); }

try {
  // Validar id
  if (empty($_GET['id'])) throw new Exception('Falta id', 400);
  $solicitud_id = (int)$_GET['id'];
  if ($solicitud_id <= 0) throw new Exception('Id inválido', 400);

  // Consulta preparada
  $sql = "SELECT si.id,
                 si.producto_id,
                 p.producto,
                 si.cantidad
          FROM solicitud_items si
          JOIN productos p ON p.id = si.producto_id
          WHERE si.solicitud_id = ?
          ORDER BY si.id ASC";
  $st = $conn->prepare($sql);
  if (!$st) throw new Exception('DB prepare: '.$conn->error, 500);

  $st->bind_param("i", $solicitud_id);
  if (!$st->execute()) throw new Exception('DB execute: '.$st->error, 500);

  $res = $st->get_result();
  $out = [];
  while ($row = $res->fetch_assoc()) { $out[] = $row; }

  // Entregar SIEMPRE JSON (aunque vacío)
  echo json_encode($out, JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
  http_response_code(($e->getCode()>=400 && $e->getCode()<600) ? $e->getCode() : 500);
  echo json_encode(['ok'=>false, 'error'=>$e->getMessage()], JSON_UNESCAPED_UNICODE);
}
