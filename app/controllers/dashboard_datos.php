<?php
/**
 * Endpoint: /app/controllers/dashboard_datos.php
 * Método: GET
 * Descripción: Datos para dashboard:
 *  - resumen (totales)
 *  - historial_dias (movimientos por día)
 *  - top_productos (más vendidos)
 *  - historial_compras (últimas salidas)
 */

header('Content-Type: application/json; charset=utf-8');

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../middleware/validar_sesion.php';
require_once __DIR__ . '/../../config/conexion.php';

// -------- RESUMEN --------
$resumen = [
    'total_productos' => 0,
    'total_stock'     => 0,
    'movimientos_hoy' => 0
];

if ($q1 = $conn->query("SELECT COUNT(*) AS total FROM productos")) {
    if ($row = $q1->fetch_assoc()) {
        $resumen['total_productos'] = (int)$row['total'];
    }
}

if ($q2 = $conn->query("SELECT COALESCE(SUM(stock),0) AS total_stock FROM productos")) {
    if ($row = $q2->fetch_assoc()) {
        $resumen['total_stock'] = (int)$row['total_stock'];
    }
}

if ($q3 = $conn->query("SELECT COUNT(*) AS total FROM movimientos WHERE DATE(fecha) = CURDATE()")) {
    if ($row = $q3->fetch_assoc()) {
        $resumen['movimientos_hoy'] = (int)$row['total'];
    }
}

// -------- HISTORIAL POR DÍA (últimos 7 días) --------
$historial_dias = [];
$sqlHist = "
    SELECT DATE(fecha) AS dia, COUNT(*) AS total
    FROM movimientos
    WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    GROUP BY DATE(fecha)
    ORDER BY dia ASC
";
if ($q4 = $conn->query($sqlHist)) {
    while ($row = $q4->fetch_assoc()) {
        $historial_dias[] = [
            'dia'   => $row['dia'],
            'total' => (int)$row['total']
        ];
    }
}

// -------- TOP PRODUCTOS (más vendidos por salidas) --------
$top_productos = [];
$sqlTop = "
    SELECT p.producto, SUM(m.cantidad) AS total_vendido
    FROM movimientos m
    JOIN productos p ON p.id = m.producto_id
    WHERE m.tipo = 'salida'
    GROUP BY p.id, p.producto
    ORDER BY total_vendido DESC
    LIMIT 6
";
if ($q5 = $conn->query($sqlTop)) {
    while ($row = $q5->fetch_assoc()) {
        $top_productos[] = [
            'producto'      => $row['producto'],
            'total_vendido' => (int)$row['total_vendido']
        ];
    }
}

// -------- HISTORIAL DE COMPRAS (últimas 10 salidas) --------
$historial_compras = [];
$sqlCompras = "
    SELECT 
        p.producto,
        m.cantidad AS unidades,
        DATE(m.fecha) AS fecha,
        (m.cantidad * p.precio_venta) AS valor_total
    FROM movimientos m
    JOIN productos p ON p.id = m.producto_id
    WHERE m.tipo = 'salida'
    ORDER BY m.fecha DESC
    LIMIT 10
";
if ($q6 = $conn->query($sqlCompras)) {
    while ($row = $q6->fetch_assoc()) {
        $historial_compras[] = [
            'producto'    => $row['producto'],
            'unidades'    => (int)$row['unidades'],
            'fecha'       => $row['fecha'],
            'valor_total' => (int)$row['valor_total']
        ];
    }
}

echo json_encode([
    'ok'                => true,
    'resumen'           => $resumen,
    'historial_dias'    => $historial_dias,
    'top_productos'     => $top_productos,
    'historial_compras' => $historial_compras
]);
