<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/../conexion.php';

try {
  // Validación mínima
  $req = ['producto_id','tipo','cantidad'];
  foreach($req as $k){ if(empty($_POST[$k])) throw new Exception("Falta $k", 400); }

  $producto_id = (int)$_POST['producto_id'];
  $tipo        = $_POST['tipo']; // 'entrada' | 'salida'
  $cantidad    = (int)$_POST['cantidad'];
  $motivo      = $_POST['motivo']  ?? null;
  $usuario     = $_POST['usuario'] ?? null;
  $rol         = $_POST['rol']     ?? 'administrador';

  if(!in_array($tipo, ['entrada','salida'])) throw new Exception('Tipo inválido', 400);
  if($cantidad <= 0) throw new Exception('Cantidad inválida', 400);

  // Manejo de archivo (opcional)
  $documento = null;
  if(!empty($_FILES['documento']['name'])){
    $dir = __DIR__ . '/docs';
    if(!is_dir($dir)) mkdir($dir, 0777, true);
    $fname = time().'_'.preg_replace('/[^A-Za-z0-9\._-]/','_', $_FILES['documento']['name']);
    $dest = $dir . '/' . $fname;
    if(!move_uploaded_file($_FILES['documento']['tmp_name'], $dest)){
      throw new Exception('No se pudo guardar el documento', 500);
    }
    $documento = $fname; // se guardará el nombre
  }

  $conn->begin_transaction();

  // Leer stock actual
  $st = $conn->prepare("SELECT stock FROM productos WHERE id=? FOR UPDATE");
  $st->bind_param("i", $producto_id);
  $st->execute();
  $res = $st->get_result();
  if($res->num_rows===0) throw new Exception('Producto no existe', 404);
  $row = $res->fetch_assoc();
  $stock = (int)$row['stock'];

  // Calcular nuevo stock
  $nuevo = ($tipo==='entrada') ? $stock + $cantidad : $stock - $cantidad;
  if($nuevo < 0) throw new Exception('Stock insuficiente para salida', 400);

  // Actualizar stock
  $st2 = $conn->prepare("UPDATE productos SET stock=? WHERE id=?");
  $st2->bind_param("ii", $nuevo, $producto_id);
  $st2->execute();

  // Insertar movimiento
  $st3 = $conn->prepare("INSERT INTO movimientos
    (producto_id,tipo,cantidad,motivo,usuario,rol,documento)
    VALUES (?,?,?,?,?,?,?)");
  $st3->bind_param("isissss", $producto_id,$tipo,$cantidad,$motivo,$usuario,$rol,$documento);
  $st3->execute();

  $conn->commit();

  echo json_encode(['ok'=>true]);

} catch(Throwable $e){
  if($conn && $conn->errno===0){ /* nada */ }
  if($conn) $conn->rollback();
  http_response_code(($e->getCode()>=400 && $e->getCode()<600)?$e->getCode():500);
  echo json_encode(['ok'=>false,'error'=>$e->getMessage()]);
}
