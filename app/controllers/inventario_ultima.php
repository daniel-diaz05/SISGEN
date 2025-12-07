<?php
/**
 * Endpoint: /uploads/inventario_ultima.php
 * Método: GET
 * Descripción: Muestra el último registro del inventario consolidado
 * Respuesta: JSON: datos del inventario más reciente
 */
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . "/../middleware/validar_sesion.php";
require_once __DIR__ . "/../../config/conexion.php";

$conn->set_charset('utf8mb4');

$ts = null;

// Leer de inventario_meta
$r = $conn->query("SELECT ultima_actualizacion AS ts FROM inventario_meta WHERE id=1");
if ($r && $row = $r->fetch_assoc()) {
  $ts = $row['ts'];
}

// Fallback: si no hay meta, usar MAX(ultima_actualizacion) de productos
if (!$ts) {
  $r2 = $conn->query("SELECT MAX(ultima_actualizacion) AS ts FROM productos");
  if ($r2 && $row2 = $r2->fetch_assoc()) $ts = $row2['ts'];
}

// Si sigue vacío, usar NOW() para no devolver null
if (!$ts) {
  $r3 = $conn->query("SELECT NOW() AS ts");
  $ts = ($r3 && $row3 = $r3->fetch_assoc()) ? $row3['ts'] : date('Y-m-d H:i:s');
}

echo json_encode(['ultima' => $ts], JSON_UNESCAPED_UNICODE);
