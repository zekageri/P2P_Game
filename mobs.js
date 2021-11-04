function initMobs(){

}

var randomSpawnMS = 1000;
var lastMobSpawn = 0;

function getRandomSpawnMS(){
    return getRandomInt(1000, 50000);
}

var mobs = [
    bigMob = {
        name:"Big Joe",
        speed:2,
        strength:5,
        size:5,
        class:"bigMob",
    },
    fastMob = {
        name:"Speedy",
        speed:6,
        strength:2,
        size:3,
        class:"fastMob",
    },
    smartMob = {
        name:"Smarty",
        speed:3,
        strength:4,
        size:3,
        class:"smartMob",
    },
    teleJani = {
        name:"Tele Jani",
        speed:2,
        strength:7,
        size:3,
        class:"teleJani",
    },
    springer = {
        name:"Springer",
        speed:3,
        strength:6,
        size:3,
        class:"springer",
    },
    titan = {
        name:"Titan",
        speed:2,
        strength:5,
        size:3,
        class:"titan",
    },
    shooter = {
        name:"Shooter",
        speed:3,
        strength:2,
        size:3,
        class:"shooter",
    },
    eater = {
        name:"Eater",
        speed:4,
        strength:1,
        size:3,
        class:"eater",
    },
    thePusher = {
        name:"The Pusher",
        speed:4,
        strength:10,
        size:3,
        class:"thePusher",
    }
];

function getRandomMob(){
    return mobs[Math.floor(Math.random()*mobs.length)];
}

function spawnRandomMob(){
    let now = new Date().getTime();
    if( now - lastMobSpawn >= randomSpawnMS ){
        lastMobSpawn = now;
        randomSpawnMS = getRandomSpawnMS();
        let randomMob = getRandomMob();
        if(randomMob.class == "thePusher" && roundCounter <= 5){ randomSpawnMS = 100; return; }
        if(randomMob.class == "titan" && roundCounter <= 3){ randomSpawnMS = 100; return; }
        addMob(randomMob);
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

function lupPlayer(playerObj){
    playerObj.level = playerObj.level + 1;
    playerObj.maxHP = playerObj.maxHP + 20;
    playerObj.health = playerObj.maxHP;
}

function unLupPlayer(playerObj){
    playerObj.level = playerObj.level - 1;
    if(playerObj.level <= 1){playerObj.level = 1;}
    playerObj.maxHP = playerObj.maxHP - 20;
    if( playerObj.maxHP <= 100 ){playerObj.maxHP = 100;}
    playerObj.health = playerObj.maxHP;
}

function damageMobByPlayer(playerObj,mobElem){
    //console.log( parseInt($(mobElem).attr("health") ))
    let mobHP = parseInt($(mobElem).attr("health"));
    mobHP = mobHP - playerObj.pushStrength;
    let difHp = 100 - mobHP
    if(mobHP <= 0){mobHP = 0; difHp = 100;}
    $(mobElem).find(".hpBar").css("background",`linear-gradient(to right, tomato ${mobHP}%, white ${difHp}%)`);
    //console.log("MOB HP: ", mobHP);
    if(difHp >= 100){
        lupPlayer(playerObj);
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
        unLupPlayer(playerObj);
        $(playerObj.id).hide();
        playerObj.deaths = playerObj.deaths + 1;
        setTimeout(() => {
            playerObj.isAlive = true;
            playerObj.health = 50;
            $(playerObj.id).find(".hpBar").css("background",`linear-gradient(to right, tomato ${playerObj.health}%, white 50%)`);
            $(playerObj.id).show();
        }, 10000);
    }
}

function addMob(mob){
    let mobID = newID();
    $(".map").append(`
        <div strength="${mob.strength}" health="100" speed="${mob.speed}" lastDX="1" lastDY="0" lastDirectionChange="0" style="display:none" name="${mob.name}" id="${mobID}" class="mob ${mob.class}">
        <div class="name">${mob.name}</div>
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

var teleportMS = 1000;

function moveMobs(){
    let now = new Date().getTime();
    if( now - lastMobMove >= 10 ){
        lastMobMove = now;
        $('.mob').each(function(i, obj) {
            let lastDirectionChange = $(this).attr("lastDirectionChange");
            let dx = parseInt($(this).attr("lastDX"));
            let dy = parseInt($(this).attr("lastDY"));
            if( now - lastDirectionChange >= randomDirectionChange ){
                randomDirectionChange = getRandomInt(0,3500);
                $(this).attr("lastDirectionChange",now);
                if( $(this).hasClass("teleJani") ){

                    $(this).hide("slow");
                    setTimeout(() => {
                        $(this).css({left:randomPosOnMap()+"px",top:randomPosOnMap()+"px"});
                        $(this).show("slow");
                    }, 100);
                    
                }else{
                    dx = getRandomMovement();
                    dy = getRandomMovement();
                    $(this).attr("lastDX",dx);
                    $(this).attr("lastDY",dy);
                }
            }
            if( !$(this).hasClass("teleJani") ){
                moveMob(dx,dy,$(this));
            }
        });
    }
}
