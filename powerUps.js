function initPowerUps(){
    spawnRandomPowerUp();
}

function newID() {
    var idStrLen = 32;
    var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36) + "_";
    idStr += (new Date()).getTime().toString(36) + "_";
    do {idStr += (Math.floor((Math.random() * 35))).toString(36);
    } while (idStr.length < idStrLen);
    return (idStr);
}

var powerUpSpawnTime = 5000;
var powrUpOnTime = 6500;

var powerUps = ["health","strength","size","color","speed"];

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}

function randomPowerUpOnTime(){
    return getRandomInt(2400,10000);
}

function randomPosOnMap(){
    return getRandomInt(0,800);
}

function spawnRandomPowerUp(){
    setInterval(() => {
        let randomPowerUp = powerUps[Math.floor(Math.random()*powerUps.length)];
        let powerUpID = newID();
        $(".map").append(`<div type="${randomPowerUp}" id="${powerUpID}" class="powerup ${randomPowerUp}" style="display:none"></div>`);
        $(`#${powerUpID}`).css({
            left: randomPosOnMap()+"px",
            top: randomPosOnMap()+"px",
        });
        $(`#${powerUpID}`).show("fast");
        setTimeout(() => {
            removePowerUp(powerUpID);
        }, randomPowerUpOnTime());
    }, powerUpSpawnTime );
}

function removePowerUp(powerUpID){
    $(`#${powerUpID}`).hide("slow",function(){
        $(this).remove();
    });
}

