<?php
require '../conexion.php';
$req=['producto','stock','codigo'];
foreach($req as $k){ if(empty($_POST[$k])){ http_response_code(400); echo "Falta $k"; exit; } }

$producto      = $_POST['producto'];
$descripcion   = $_POST['descripcion'] ?? null;
$categoria     = $_POST['categoria'] ?? null;
$stock         = (int)$_POST['stock'];
$codigo        = $_POST['codigo'];
$precio_compra = isset($_POST['precio_compra']) ? (float)$_POST['precio_compra'] : 0;
$precio_venta  = isset($_POST['precio_venta'])  ? (float)$_POST['precio_venta']  : 0;
$imagen        = $_POST['imagen'] ?? null;

$stmt=$conn->prepare("INSERT INTO productos
 (producto, descripcion, categoria, stock, codigo, precio_compra, precio_venta, imagen)
 VALUES (?,?,?,?,?,?,?,?)");
$stmt->bind_param("sssissds",$producto,$descripcion,$categoria,$stock,$codigo,$precio_compra,$precio_venta,$imagen);

if($stmt->execute()){ echo "OK"; } else { http_response_code(500); echo "Error: ".$conn->error; }

$conn->query("UPDATE inventario_meta SET ultima_actualizacion = NOW() WHERE id=1");
