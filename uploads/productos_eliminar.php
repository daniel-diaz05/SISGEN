<?php
require '../config/conexion.php';
if(empty($_POST['id'])){ http_response_code(400); echo "Falta id"; exit; }
$id=(int)$_POST['id'];

$stmt=$conn->prepare("DELETE FROM productos WHERE id=?");
$stmt->bind_param("i",$id);
if($stmt->execute()){ echo "OK"; } else { http_response_code(500); echo "Error: ".$conn->error; }

$conn->query("UPDATE inventario_meta SET ultima_actualizacion = NOW() WHERE id=1");