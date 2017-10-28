<?php
// Adapcación realizada por Silk aplicaciones
// MAINTAINER: Iván Alvarez <ijalvarez@silk.es>

include "../lib.php";
header("Access-Control-Allow-Origin: *");

$json = file_get_contents('php://input');
$obj = json_decode($json);

saveHighScoreFile($obj);


header("Content-Type: application/json;charset=utf-8");

$json = json_encode($obj);

echo $json;