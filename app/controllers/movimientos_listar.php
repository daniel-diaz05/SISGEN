<?php
/**
 * Endpoint: /uploads/movimientos_listar.php
 * Método: GET
 * Descripción: Lista todos los movimientos de inventario.
 * Respuesta: JSON: { id, producto_id, tipo, cantidad, ... }
 */
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . "/../middleware/validar_sesion.php";
require_once __DIR__ . "/../../config/conexion.php";

$sql = "SELECT m.id, m.producto_id, p.producto, m.tipo, m.cantidad, m.motivo,
               m.usuario, m.rol, m.documento, m.fecha
        FROM movimientos m
        JOIN productos p ON p.id = m.producto_id
        ORDER BY m.fecha DESC, m.id DESC
        LIMIT 200";
$res = $conn->query($sql);
$out = [];
while($r = $res->fetch_assoc()){ $out[] = $r; }
echo json_encode($out, JSON_UNESCAPED_UNICODE);
