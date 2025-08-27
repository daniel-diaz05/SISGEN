<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/../conexion.php';

try {
  if (empty($_POST['solicitante'])) throw new Exception('Falta solicitante', 400);
  $solicitante = trim($_POST['solicitante']);
  $motivo = $_POST['motivo'] ?? null;

  if (empty($_POST['items_json'])) throw new Exception('Faltan items', 400);
  $items = json_decode($_POST['items_json'], true);
  if (!is_array($items) || !count($items)) throw new Exception('Items inválidos', 400);

  $conn->begin_transaction();

  $st = $conn->prepare("INSERT INTO solicitudes (solicitante, motivo) VALUES (?,?)");
  $st->bind_param("ss", $solicitante, $motivo);
  $st->execute();
  $solicitud_id = $conn->insert_id;

  $sti = $conn->prepare("INSERT INTO solicitud_items (solicitud_id, producto_id, cantidad) VALUES (?,?,?)");
  foreach ($items as $it) {
    $pid = (int)($it['producto_id'] ?? 0);
    $cant = (int)($it['cantidad'] ?? 0);
    if ($pid <= 0 || $cant <= 0) throw new Exception('Item inválido', 400);
    $sti->bind_param("iii", $solicitud_id, $pid, $cant);
    $sti->execute();
  }

  $conn->commit();
  echo json_encode(['ok'=>true]);

} catch(Throwable $e){
  if ($conn) $conn->rollback();
  http_response_code(($e->getCode()>=400 && $e->getCode()<600)?$e->getCode():500);
  echo json_encode(['ok'=>false,'error'=>$e->getMessage()]);
}
