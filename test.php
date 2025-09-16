
<?php
require_once "config/conexion.php";

$res = $conn->query("SHOW TABLES");
echo "<h2>Tablas en la BD sisgen:</h2>";
while ($row = $res->fetch_array()) {
    echo $row[0] . "<br>";
}
?>
