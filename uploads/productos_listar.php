<?php
require_once __DIR__ . '/../config/conexion.php';
$sql="SELECT id, producto, descripcion, categoria, stock, codigo,
             precio_compra, precio_venta, imagen, ultima_actualizacion
      FROM productos ORDER BY producto ASC";
$r=$conn->query($sql);
$out=[]; while($x=$r->fetch_assoc()) $out[]=$x;
header('Content-Type: application/json');
echo json_encode($out);

