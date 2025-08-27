<?php
require '../conexion.php';
if(empty($_POST['id'])){ http_response_code(400); echo "Falta id"; exit; }
$id=(int)$_POST['id'];

$campos=[]; $vals=[]; $types='';
$fields=['producto'=>'s','descripcion'=>'s','categoria'=>'s','stock'=>'i',
         'codigo'=>'s','precio_compra'=>'d','precio_venta'=>'d','imagen'=>'s'];

foreach($fields as $f=>$t){
  if(isset($_POST[$f])){
    $campos[]="$f=?"; $vals[]=$_POST[$f]; $types.=$t;
  }
}
if(!$campos){ http_response_code(400); echo "Nada para actualizar"; exit; }

$sql="UPDATE productos SET ".implode(',', $campos)." WHERE id=?";
$types.='i'; $vals[]=$id;

$stmt=$conn->prepare($sql);
$stmt->bind_param($types, ...$vals);
if($stmt->execute()){ echo "OK"; } else { http_response_code(500); echo "Error: ".$conn->error; }

$conn->query("UPDATE inventario_meta SET ultima_actualizacion = NOW() WHERE id=1");

