<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/../conexion.php';

try{
  if (empty($_POST['id']) || empty($_POST['accion'])) throw new Exception('Faltan datos', 400);
  $id = (int)$_POST['id'];
  $accion = $_POST['accion']; // 'aprobar' | 'rechazar'

  if (!in_array($accion, ['aprobar','rechazar'])) throw new Exception('Acción inválida', 400);
  $nuevo = ($accion==='aprobar') ? 'aprobada' : 'rechazada';

  // Cambiar estado solo si está pendiente
  $st = $conn->prepare("UPDATE solicitudes SET estado=? WHERE id=? AND estado='pendiente'");
  $st->bind_param("si", $nuevo, $id);
  $st->execute();

  echo json_encode(['ok'=>true]);
} catch(Throwable $e){
  http_response_code(($e->getCode()>=400 && $e->getCode()<600)?$e->getCode():500);
  echo json_encode(['ok'=>false,'error'=>$e->getMessage()]);
}
