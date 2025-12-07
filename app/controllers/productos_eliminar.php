<?php
/**
 * Endpoint: /uploads/productos_eliminar.php
 * Método: POST
 * Descripción: Elimina un producto por su ID.
 * Entrada: form-data (id)
 * Respuesta: JSON: éxito o error.
 */

require_once __DIR__ . "/../middleware/validar_sesion.php";
require_once __DIR__ . "/../../config/conexion.php";

if(empty($_POST['id'])){ http_response_code(400); echo "Falta id"; exit; }
$id=(int)$_POST['id'];

$stmt=$conn->prepare("DELETE FROM productos WHERE id=?");
$stmt->bind_param("i",$id);
if($stmt->execute()){ echo "OK"; } else { http_response_code(500); echo "Error: ".$conn->error; }

$conn->query("UPDATE inventario_meta SET ultima_actualizacion = NOW() WHERE id=1");