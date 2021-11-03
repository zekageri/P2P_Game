function initMobs(){

}

var randomSpawnMS = 1000;
var lastMobSpawn = 0;

function getRandomSpawnMS(){
    return getRandomInt(1000, 50000);
}

var mobs = [
    bigMob = {
        name:"Big Mob",
        speed:2,
        strength:5,
        size:5,
        class:"bigMob",
    },
    fastMob = {
        name:"Fast Mob",
        speed:4,
        strength:2,
        size:3,
        class:"fastMob",
    }
];

function spawnRandomMob(){
    let now = new Date().getTime();
    if( now - lastMobSpawn >= randomSpawnMS ){
        lastMobSpawn = now;
        randomSpawnMS = getRandomSpawnMS();
        let randomMob = mobs[Math.floor(Math.random()*mobs.length)];
        addMob(randomMob);
        //console.log(randomMob);
    }
}

var moveMob = function(dx, dy, mob){
    let pos = mob.position();
    pos.left += (dx||0) * parseInt(mob.attr("speed"));
    pos.top += (dy||0) * parseInt(mob.attr("speed"));

    let outOfMap = false;
    if(pos.left < 1){ outOfMap = true; }
    if(pos.top < 1){ outOfMap = true; }
    if(pos.left > 749){ outOfMap = true; }
    if(pos.top > 749){ outOfMap = true; }
    if( !outOfMap ){
        mob.css( {left: pos.left + "px",top: pos.top + "px"} );
    }
};

function damageMobByPlayer(playerObj,mobElem){
    //console.log( parseInt($(mobElem).attr("health") ))
    let mobHP = parseInt($(mobElem).attr("health"));
    mobHP = mobHP - playerObj.pushStrength;
    let difHp = 100 - mobHP
    if(mobHP <= 0){mobHP = 0; difHp = 100;}
    $(mobElem).find(".hpBar").css("background",`linear-gradient(to right, tomato ${mobHP}%, white ${difHp}%)`);
    //console.log("MOB HP: ", mobHP);
    if(difHp >= 100){
        $(mobElem).remove();
        addNoty(`${$(mobElem).attr("name")} died by player: ${playerObj.name}`);
    }else{
        $(mobElem).attr("health",mobHP);
    }
}

function damagePlayer(playerObj,mobElem){
    let mobStrength = parseInt(mobElem.attr("strength"));
    playerObj.health = playerObj.health - mobStrength;
    let difHp = 100 - playerObj.health
    if(playerObj.health <= 0){playerObj.health = 0; difHp = 100;}
    $(playerObj.id).find(".hpBar").css("background",`linear-gradient(to right, tomato ${playerObj.health}%, white ${difHp}%)`);
    if(difHp >= 100){
        addNoty(`${playerObj.name} killed by ${mobElem.attr("name")}`);
        playerObj.isAlive = false;
        $(playerObj.id).hide();
        setTimeout(() => {
            playerObj.isAlive = true;
            playerObj.health = 50;
            $(playerObj.id).find(".hpBar").css("background",`linear-gradient(to right, tomato ${playerObj.health}%, white 50%)`);
            $(playerObj.id).show("slow");
        }, 10000);
    }
}

function addMob(mob){
    let mobID = newID();
    $(".map").append(`
        <div strength="${mob.strength}" health="100" speed="${mob.speed}" lastDX="1" lastDY="0" lastDirectionChange="0" style="display:none" name="${mob.name}" id="${mobID}" class="mob ${mob.class}">
            <div class="hpBar"></div>
        </div>
    `);
    $(`#${mobID}`).css({
        left: randomPosOnMap()+"px",
        top: randomPosOnMap()+"px",
    });
    $(`#${mobID}`).show("fast");
    addNoty(`${mob.name} spawned`);
}

function getRandomMovement(){
    return Math.floor(Math.random() * 3) -1
}
var lastMobMove = 0;
var randomDirectionChange = 1500;

function moveMobs(){
    let now = new Date().getTime();
    if( now - lastMobMove >= 50 ){
        lastMobMove = now;
        $('.mob').each(function(i, obj) {
            let lastDirectionChange = $(this).attr("lastDirectionChange");
            let dx = parseInt($(this).attr("lastDX"));
            let dy = parseInt($(this).attr("lastDY"));
            if( now - lastDirectionChange >= randomDirectionChange ){
                randomDirectionChange = getRandomInt(0,3500);
                $(this).attr("lastDirectionChange",now);
                dx = getRandomMovement();
                dy = getRandomMovement();
                $(this).attr("lastDX",dx);
                $(this).attr("lastDY",dy);
                //console.log(dx,dy,$(this).attr("lastDirectionChange"))
            }
            moveMob(dx,dy,$(this));
        });
    }
}
