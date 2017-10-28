// Copyright 2017 Google Inc. All Rights Reserved.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var default_duration = 40; 

// These are set in config.js, and are specific to your cluster setup
var api = new API(servicehost);
var apihs = new API(adminhost);
var deploymentAPI = new DEPLOYMENTAPI(adminhost);
var pods = new PODS();
var podsUI = new PODSUI(pods);
var bombUI = new BOMBUI("assets/img/bomb_waiting.png", "assets/img/bomb_explode.png");
var game = new GAME();
var clock = "";
var score = new SCORE();
var sounds = new SOUNDS();
var toph = new HIGHSCORE();
var nombre ="";


sounds.SetWhack("assets/audio/pop.wav",.5);
sounds.SetExplosion("assets/audio/explosion.wav",.5);
sounds.SetCountdown("assets/audio/countdown.mp3",.5);
sounds.SetStartup("assets/audio/startup.mp3",.5);

document.addEventListener('DOMContentLoaded', function() {
    $("#start-modal").show();
    $(".timer").html(default_duration);
    setReport("Kubernetes service not started yet.");
    deploymentAPI.Delete();
    localStorage.name = 'GameMole';
    var interval = Math.random() * 200000;
    document.querySelector("#bomb").addEventListener("click", bombClickHandler);
    document.querySelector("#deploy-start").addEventListener("click", startDeployment);
    document.querySelector("#restart").addEventListener("click", restart);
    showHighscores();
});

function setReport(msg, color){
    if (typeof color == "undefined") color = "#333333";
    var report = document.querySelector(".report");
    nombre = document.getElementById('name').value
    report.innerHTML = "<span>" + msg + "<br>" + nombre + "</span>";
    report.style.color = color;
}

function endDeployment(){
    var mensaje="";
    deploymentAPI.Delete();
    game.Stop();
    showTotals();
    if ( updateHighScores() == true ) {
     // si está entre los top 5 persistelo en disco
        mensaje="{\"NombreTop1\":\""+toph.GetNombreTop1()+"\",\"HighScoreTop1\":"+toph.GetHighScoreTop1().toString()+",";
        mensaje=mensaje + "\"NombreTop2\":\""+toph.GetNombreTop2()+"\",\"HighScoreTop2\":"+toph.GetHighScoreTop2().toString()+",";
        mensaje=mensaje + "\"NombreTop3\":\""+toph.GetNombreTop3()+"\",\"HighScoreTop3\":"+toph.GetHighScoreTop3().toString()+",";
        mensaje=mensaje + "\"NombreTop4\":\""+toph.GetNombreTop4()+"\",\"HighScoreTop4\":"+toph.GetHighScoreTop4().toString()+",";
        mensaje=mensaje + "\"NombreTop5\":\""+toph.GetNombreTop5()+"\",\"HighScoreTop5\":"+toph.GetHighScoreTop5().toString()+"}";
        saveHighscores(mensaje);
        score.ResetScore();
    }
    podsUI.ClearAll();
    setReport("Kubernetes service went away!");
    showModal("#end-modal");
}

function showTotals(){
    $("#nombre").html(document.getElementById('name').value);
    $("#total-pods").html(score.GetPods() + " pods");
    $("#total-knockdowns").html(score.GetKnockDowns() + " service disruptions");
    $("#total-score").html(document.querySelector(".scoreboard .total").innerHTML + " points");
}

function showHighscores(){
    apihs.HighScore(handleHighScores, handleHighScoreserror);

}

function updateHighScores(){
    var points=score.GetTotal();
    if (points > toph.GetHighScoreTop1()) {
        toph.Nombre5(toph.GetNombreTop4());
        toph.Score5(toph.GetHighScoreTop4());
        toph.Nombre4(toph.GetNombreTop3());
        toph.Score4(toph.GetHighScoreTop3());
        toph.Nombre3(toph.GetNombreTop2());
        toph.Score3(toph.GetHighScoreTop2());
        toph.Nombre2(toph.GetNombreTop1());
        toph.Score2(toph.GetHighScoreTop1());
        toph.Nombre1 (document.getElementById('name').value);
        toph.Score1 (points);
        return true;
    }
    if (points > toph.GetHighScoreTop2()) {
        toph.Nombre5(toph.GetNombreTop4());
        toph.Score5(toph.GetHighScoreTop4());
        toph.Nombre4(toph.GetNombreTop3());
        toph.Score4(toph.GetHighScoreTop3());
        toph.Nombre3(toph.GetNombreTop2());
        toph.Score3(toph.GetHighScoreTop2());
        toph.Nombre2 (document.getElementById('name').value);
        toph.Score2 (points);
        return true;
    }
    if (points > toph.GetHighScoreTop3()) {
        toph.Nombre5(toph.GetNombreTop4());
        toph.Score5(toph.GetHighScoreTop4());
        toph.Nombre4(toph.GetNombreTop3());
        toph.Score4(toph.GetHighScoreTop3());
        toph.Nombre3 (document.getElementById('name').value);
        toph.Score3 (points);
        return true;
    }
    if (points > toph.GetHighScoreTop4()) {
        toph.Nombre5(toph.GetNombreTop4());
        toph.Score5(toph.GetHighScoreTop4());
        toph.Nombre4 (document.getElementById('name').value);
        toph.Score4 (points);
        return true;
    }
    if (points > toph.GetHighScoreTop5()) {
        toph.Nombre5 (document.getElementById('name').value);
        toph.Score5 (points);
        return true;
    }
    return false;
}

function handleHighScores(e){

    toph.Nombre1(e["NombreTop1"]);
    toph.Nombre2(e["NombreTop2"]);
    toph.Nombre3(e["NombreTop3"]);
    toph.Nombre4(e["NombreTop4"]);
    toph.Nombre5(e["NombreTop5"]);

    toph.Score1(e["HighScoreTop1"]);
    toph.Score2(e["HighScoreTop2"]);
    toph.Score3(e["HighScoreTop3"]);
    toph.Score4(e["HighScoreTop4"]);
    toph.Score5(e["HighScoreTop5"]);

    document.querySelector(".highscore .NameTop1").innerHTML = toph.GetNombreTop1();
    document.querySelector(".highscore .ScoreTop1").innerHTML = toph.GetHighScoreTop1();
    document.querySelector(".highscore .NameTop2").innerHTML = toph.GetNombreTop2();
    document.querySelector(".highscore .ScoreTop2").innerHTML = toph.GetHighScoreTop2();
    document.querySelector(".highscore .NameTop3").innerHTML = toph.GetNombreTop3();
    document.querySelector(".highscore .ScoreTop3").innerHTML = toph.GetHighScoreTop3();
    document.querySelector(".highscore .NameTop4").innerHTML = toph.GetNombreTop4();
    document.querySelector(".highscore .ScoreTop4").innerHTML = toph.GetHighScoreTop4();
    document.querySelector(".highscore .NameTop5").innerHTML = toph.GetNombreTop5();
    document.querySelector(".highscore .ScoreTop5").innerHTML = toph.GetHighScoreTop5();
    /*alert("OK " + e["NombreTop1"]);*/

}

function handleHighScoreserror(e,textStatus, errorThrown){
    alert("Error "+ errorThrown);
}

function saveHighscores($tophighscores) {
    apihs.SaveHighScore(handleSaveHighScores, handleSaveHighScoreserror,$tophighscores);
}

function handleSaveHighScores(){
    return;
}

function handleSaveHighScoreserror(e,textStatus, errorThrown){
    alert("Error "+ errorThrown);
}



function startDeployment(){
    deploymentAPI.Create(initGame,genericError);
    hideModal("#start-modal");
    setReport("Kubernetes starting up.");
}

function initGame(){
    game.Start(getColor, showScore, getPods, getTimeLeft);
}

function getColor(){
    api.Color(handleColor, handleColorError);
}

function getTimeLeft(){
    if (clock != ""){
        $(".timer").html(clock.getTimeLeft());
        if (clock.getTimeLeft() <= 4){
            sounds.PlayCountdown();
        }
    }
}

function handleColor(e){
    if (game.GetState() == "started"){
        game.Init();
        clock = new CLOCK(default_duration, endDeployment);
        sounds.PlayStartup();
    }

    if (game.GetState() == "running"){
        game.SetServiceUp();
        setReport("Kubernetes service is UP!", e);
    }
    
}

function handleColorError(e,textStatus, errorThrown){
    if (game.GetState() == "running") {
        //setReport("Kubernetes service is DOWN!", "#FF0000");
        //alertYouKilledIt();
    }
}

function showScore(){
    document.querySelector(".scoreboard .total").innerHTML = score.GetTotal();
    if (score.GetTotal() >= 25 && !game.HasBombShowed()){
        bombUI.Show();
        game.SetBombShowed();
    }
}

function setHighScore() {
     document.querySelector(".highscore .NameTop1").innerHTML = score.GetTotal();
}

function getPods(){
    deploymentAPI.Get(handlePods, handlePodsError);
}

function handlePods(e){
    if (game.GetState() == "done") {
        return;
    }

    podsUI.DrawPods(e, whackHandler);
    if (podsUI.GetAlldown()== true) {
        setReport("Kubernetes service is DOWN!", "#FF0000");
        alertYouKilledIt();
    }

}

function handlePodsError(e){
    $(".pods").html("");
    console.log("Error getting pods:", e);
}

function alertYouKilledIt(){
    if (!game.IsServiceDown() && game.GetState() == "running"){
        console.log("Killed it.");
        game.SetServiceDown();
        score.KnockDown()
        $(".alert .msg").html("You knocked down the service.");
        $(".alert").show();
        setTimeout(hideAlert, 3000);
    }
}

function whackHandler(e){
    sounds.PlayWhack();
    killPod(e.target.dataset.selflink)
}

function killPod(selflink){
    deploymentAPI.DeletePod(selflink, score.KillPod, podError);
}

function bombClickHandler(e){
    deploymentAPI.Get(bombBlastHandler, genericError);
}

function bombBlastHandler(e){
    sounds.PlayExplosion();
    for (var i = 0; i < e.items.length; i++){
        var pod = e.items[i];
        if (pod.status.phase == "Running"){
            killPod(pod.metadata.selfLink);
        }
    }
    bombUI.Explode();
}

// Add functions below to lib.js
function genericError(e){
    console.log("Error: ", e);
}

function hideModal(id){
    var modal = $(id);
    modal.fadeOut();
}

function podError(e){
    console.log("Pod already gone? :", e);
}

function showModal(id){
    var modal = $(id);
    modal.fadeIn('slow');
}

function hideAlert(){
    $(".alert").fadeOut('slow');
}