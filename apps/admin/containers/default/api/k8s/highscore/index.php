<?php
// Adapcación realizada por Silk aplicaciones
// MAINTAINER: Iván Alvarez <ijalvarez@silk.es>

include "../lib.php";
header("Access-Control-Allow-Origin: *");

$result = new stdClass();
$result->NombreTop1 = getHighScoreName(1);
$result->HighScoreTop1 = getHighScoreValue(1);
$result->NombreTop2 = getHighScoreName(2);
$result->HighScoreTop2 = getHighScoreValue(2);
$result->NombreTop3 = getHighScoreName(3);
$result->HighScoreTop3 = getHighScoreValue(3);
$result->NombreTop4 = getHighScoreName(4);
$result->HighScoreTop4 = getHighScoreValue(4);
$result->NombreTop5 = getHighScoreName(5);
$result->HighScoreTop5 = getHighScoreValue(5);

$json = json_encode($result);
header("Content-Type: application/json;charset=utf-8");
echo $json;