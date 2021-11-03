var playerOnekeys = {UP: 38,LEFT: 37,RIGHT: 39,DOWN: 40,ATTACK:13};
var playerTwokeys = {UP: 87,LEFT: 65,RIGHT: 68,DOWN: 83,ATTACK:226};
var FPS = 60;
var roundCounter    = 1;
var playerScale     = 50;

var gameStop = true;

function increaseRound(){
    roundCounter++;
    $(".roundCounter").text(`Round ${roundCounter}`);
    if(roundCounter > 3){
        $(".roundCounter").css("color","red");
    }
}

function addPlayerText(player,text){
    player.find(".playerTextBubble").remove();
    let textID = newID();
    player.append(`<div id="${textID}" class="playerTextBubble">${text}</div>`);
    setTimeout(() => {
        $(`#${textID}`).remove();
    }, 1500);
}

function resetStats(){
    playerOne.moveStep      = 1.5;
    playerOne.pushStrength  = 5;
    playerOne.growAmount    = 20;
    playerOne.health        = 100;
    playerOne.lastAtkMs     = 0;
    playerOne.attackSpeed   = 500;

    playerTwo.moveStep      = 1.5;
    playerTwo.pushStrength  = 5;
    playerTwo.growAmount    = 20;
    playerTwo.health        = 100;
    playerTwo.lastAtkMs     = 0;
    playerTwo.attackSpeed   = 500;
}

var playerOne = {
    name    : "Player One",
    moveStep: 1.5,
    id      : "#playerOne",
    x       : 250,
    y       : 350,
    isAlive : true,
    wins         : 0,
    pushStrength : 5,
    growAmount   : 20,
    health       : 100,
    lastAtkMs    : 0,
    attackSpeed  : 500
};

var playerTwo = {
    name    : "Player Two",
    moveStep: 1.5,
    id      : "#playerTwo",
    x       : 500,
    y       : 350,
    isAlive : true,
    wins         : 0,
    pushStrength : 5,
    growAmount   : 20,
    health       : 100,
    lastAtkMs    : 0,
    attackSpeed  : 500
};

var lastStatDisplay = 0;
var statDisplayTime = 500;

function displayPlayerStats(){
    let now = new Date().getTime();
    if( now - lastStatDisplay >= statDisplayTime ){
        lastStatDisplay = now;
        if(playerOne.isAlive){
            $(".playerOneStatWrapper").show();
            for (const statname in playerOne) {
                if (Object.hasOwnProperty.call(playerOne, statname)) {
                    const stat = playerOne[statname];
                    $(".playerOneStatWrapper").find(`.indicator.${statname}`).text(stat);
                }
            }
        }else{
            $(".playerOneStatWrapper").hide();
        }

        if(playerTwo.isAlive){
            $(".playerTwoStatWrapper").show();
            for (const statname in playerTwo) {
                if (Object.hasOwnProperty.call(playerTwo, statname)) {
                    const stat = playerTwo[statname];
                    $(".playerTwoStatWrapper").find(`.indicator.${statname}`).text(stat);
                }
            }
        }else{
            $(".playerTwoStatWrapper").hide();
        }
    }
}

function setKeyEvents(){
    $(document).on("keydown keyup", function (e) {
        var keyCode = e.keyCode || e.which;
        if (e.preventDefault) { e.preventDefault();}
        else {e.returnValue = false; }
        playerOnekeys[keyCode] = e.type == 'keydown';
        playerTwokeys[keyCode] = e.type == 'keydown';
    });
}


function getRandomSuccessWord(){
    var successWords = ["Jipii","Eztneked","EZ","GG HF","hueuhueu"];
    return successWords[Math.floor(Math.random()*successWords.length)];
}

function getRandomCurseWord(){
    var curseWords = ["Shajsze","fuk","why u hurt me","nooo"];
    return curseWords[Math.floor(Math.random()*curseWords.length)];
}

function getRandomHitText(){
    var hitTexts = ["Lick u","Will win","U smal","Stronker"];
    return hitTexts[Math.floor(Math.random()*hitTexts.length)];
}

function pushOtherPlayer(playerObj,otherPlayerObj){
    let playerPos       =  $(playerObj.id).position();
    let otherPlayerPos  =  $(otherPlayerObj.id).position();
    let strength        =  playerObj.pushStrength;
    let lastPos         =  playerPos;
    if( playerPos.top < otherPlayerPos.top ){
        //console.log("Other player is below");
        otherPlayerPos.top = otherPlayerPos.top + strength;
    }
    if( playerPos.left < otherPlayerPos.left ){
        //console.log("Other player is to the right");
        otherPlayerPos.left = otherPlayerPos.left + strength;
    }
    if( playerPos.top > otherPlayerPos.top ){
        //console.log("Other player is above");
        otherPlayerPos.top = otherPlayerPos.top - strength;
    }
    if( playerPos.left > otherPlayerPos.left ){
        //console.log("Other player is to the left");
        otherPlayerPos.left = otherPlayerPos.left - strength;
    }
    addPlayerText($(playerObj.id),getRandomHitText());
    otherPlayerObj.x = otherPlayerPos.left;
    otherPlayerObj.y = otherPlayerPos.top;
    $(otherPlayerObj.id).stop();
    $(otherPlayerObj.id).animate({ left: otherPlayerPos.left+"px",top:otherPlayerPos.top+"px" });
}

function addNoty(text){
    $(".notyBox").append(`
        <div class="notyWrapper">
            ${text}
        </div>
    `);
    $('.notyBox').scrollTop($('.notyBox')[0].scrollHeight);
}

function pushByMoveOtherPlayer(playerObj,otherPlayerObj){
    let playerPos       =   $(playerObj.id).position();
    let otherPlayerPos  =   $(otherPlayerObj.id).position();
    let lastPos         =   otherPlayerPos;
    if( playerPos.top < otherPlayerPos.top ){
        //console.log("Other player is below");
        otherPlayerPos.top = otherPlayerPos.top + 5;
        playerPos.top = playerPos.top - 10;
    }
    if( playerPos.left < otherPlayerPos.left ){
        //console.log("Other player is to the right");
        otherPlayerPos.left = otherPlayerPos.left + 5;
        playerPos.left = playerPos.left - 10;
    }
    if( playerPos.top > otherPlayerPos.top ){
        //console.log("Other player is above");
        otherPlayerPos.top = otherPlayerPos.top - 5;
        playerPos.top = playerPos.top + 10;
    }
    if( playerPos.left > otherPlayerPos.left ){
        //console.log("Other player is to the left");
        otherPlayerPos.left = otherPlayerPos.left - 5;
        playerPos.left = playerPos.left + 10;
    }
    addPlayerText($(otherPlayerObj.id),getRandomCurseWord());
    addPlayerText($(playerObj.id),getRandomSuccessWord());
    
    playerObj.x = playerPos.left;
    playerObj.y = playerPos.top;
    otherPlayerObj.x = otherPlayerPos.left;
    otherPlayerObj.y = otherPlayerPos.top;
    $(otherPlayerObj.id).stop();
    $(otherPlayerObj.id).animate({ left: otherPlayerPos.left+"px",top:otherPlayerPos.top+"px" });
    $(playerObj.id).stop();
    $(playerObj.id).animate({ left: playerPos.left+"px",top:playerPos.top+"px" },60,"linear");
}

function resetPlayerPosition(playerObj,otherPlayerObj){
    //nextRoundSound();
    playSound("nextRound");

    let startPos = $(playerObj.id).attr("startPos").split(";");
    let x    = startPos[0].split(":")[1];
    let y   = startPos[1].split(":")[1];
    $(playerObj.id).stop();
    $(playerObj.id).css( {left: x,top: y} );
    playerObj.x = parseInt(x);
    playerObj.y = parseInt(y);

    startPos = $(otherPlayerObj.id).attr("startPos").split(";");
    x    = startPos[0].split(":")[1];
    y   = startPos[1].split(":")[1];
    $(otherPlayerObj.id).stop();
    $(otherPlayerObj.id).css( {left: x,top: y} );
    otherPlayerObj.x = parseInt(x);
    otherPlayerObj.y = parseInt(y);

    console.log(playerObj,otherPlayerObj);
    
    otherPlayerObj.wins = otherPlayerObj.wins + 1;
    addNoty( `${otherPlayerObj.name} win round ${roundCounter}` );

    $(playerObj.id).find(".hpBar").css("background",`linear-gradient(to right, tomato 100%, white 0%)`);
    $(otherPlayerObj.id).find(".hpBar").css("background",`linear-gradient(to right, tomato 100%, white 0%)`);
    removeAllMobs();
    resetStats();
    increaseRound();
}

function removeAllMobs(){
    $(".mob").remove();
}

function addHealth(playerObj,amount){
    playerObj.health = playerObj.health + amount;
    if( playerObj.health > 100 ){playerObj.health = 100;}
    let difHp = 100 - playerObj.health
    $(playerObj.id).find(".hpBar").css("background",`linear-gradient(to right, tomato ${playerObj.health}%, white ${difHp}%)`);
}

var counterTimer;
var seCounterBack = 10;
function lowerHpBy(damagedPlayer,playerObj){
    damagedPlayer.health = damagedPlayer.health - playerObj.pushStrength;
    let difHp = 100 - damagedPlayer.health
    if(damagedPlayer.health <= 0){damagedPlayer.health = 0; difHp = 100;}
    $(damagedPlayer.id).find(".hpBar").css("background",`linear-gradient(to right, tomato ${damagedPlayer.health}%, white ${difHp}%)`);
    if(difHp >= 100){
        resetPlayerPosition(damagedPlayer,playerObj);
        roundEnd();
    }
}

function roundEnd(){
    gameStop = true;
    $(".counterBack").show();
    clearInterval(counterTimer);
    counterTimer = setInterval(() => {
        $(".counterBack").text(seCounterBack);
        seCounterBack = seCounterBack-1;
    }, 1000);
    setTimeout(() => {
        gameStop = false;
        $(".counterBack").hide();
        seCounterBack = 10;
        $(".counterBack").text(seCounterBack);
        addNoty( `Game Starting` );
        clearInterval(counterTimer);
    }, 11000);
}

function attack(playerObj,otherPlayerObj){
    let now = new Date().getTime();
    if( now - playerObj.lastAtkMs >= playerObj.attackSpeed ){
        playerObj.lastAtkMs = now;
        let growAmount = playerObj.growAmount;
        let scale = playerScale + growAmount+"px";
        let marginAmount = "-"+(parseInt(scale)-playerScale)/2+"px";
        $(playerObj.id).css({
            width: scale,
            height: scale,
            margin: marginAmount
        });

        let hitMob = false;
        $('.mob').each(function(i, obj) {
            let mobElem = $(this);
            if( playerOverlaps( $(playerObj.id), mobElem ) ){
                damageMobByPlayer(playerObj,mobElem);
                addNoty( `${playerObj.name} hit ${$(this).attr("name")}`);
                hitMob = true;
            }
        });

        if( playerOverlaps( $(playerObj.id),$(otherPlayerObj.id) ) ){
            //console.log( `${ playerObj.name } HIT ${otherPlayerObj.name}` );
            addNoty( `${ playerObj.name } HIT ${otherPlayerObj.name}` );
            lowerHpBy(otherPlayerObj,playerObj);
            //hitSound();
            playSound("hit");
            pushOtherPlayer( playerObj, otherPlayerObj );
        }else{
            playSound("miss");
            //console.log( `${ playerObj.name } missed ${otherPlayerObj.name}` );
            if(!hitMob){
                addNoty( `${ playerObj.name } missed` );
                addPlayerText($(playerObj.id),"Upsz");
            }
        }
        setTimeout(() => {
            $(playerObj.id).css({
                width:playerScale+"px",
                height:playerScale+"px",
                margin: "0px"
            });
        }, 100);
    }
}

function addPowerUpToPlayer(type,playerObj){
    if( type == "strength" ){
        playerObj.pushStrength = playerObj.pushStrength + 5;
        addPlayerText($(playerObj.id),"Stronk");
    }else if( type == "health" ){
        addHealth(playerObj,10);
        addPlayerText($(playerObj.id),"Helt");
    }else if( type == "size" ){
        playerObj.growAmount = playerObj.growAmount + 5;
        addPlayerText($(playerObj.id),"Muhaha");
    }else if( type == "color" ){
        playerObj.color = "";
    }else if( type == "speed" ){
        playerObj.moveStep = playerObj.moveStep + 0.5;
        addPlayerText($(playerObj.id),"Me speed");
    }
    $(playerObj.id).css("border","2px solid green");
    setTimeout(() => {
        $(playerObj.id).css("border","1px solid");
    }, 350);
   //console.log(` ${ playerObj.name } got ${type} `);
    addNoty( ` ${ playerObj.name } got ${type} ` );
}

function checkPowerUpCollision(){
    $('.powerup').each(function(i, obj) {
        if(playerOne.isAlive){
            if( playerOverlaps($(playerOne.id),this) ){
                let type = $(this).attr("type");
                addPowerUpToPlayer(type,playerOne);
                $(this).hide("fast").remove();
                //return false;
            }
        }
        if(playerTwo.isAlive){
            if( playerOverlaps($(playerTwo.id),this) ){
                let type = $(this).attr("type");
                addPowerUpToPlayer(type,playerTwo);
                $(this).hide("fast").remove();
                //return false;
            }
        }
    });
}

function indicateMapCollision(){
    $(".map").css("border","2px solid red");
    setTimeout(() => {
        $(".map").css("border","1px");
    }, 200);
}

var lastMapCollisionTime = 0;
var collisionCheckMS = 200;
function checkMapCollision(){
    let now = new Date().getTime();
    if( now - lastMapCollisionTime >= collisionCheckMS ){
        lastMapCollisionTime = now;
        if(playerOne.isAlive){
            if( playerOne.x < 0 || playerOne.y < 0 || playerOne.y > 750 || playerOne.x > 750 ){
                if(playerOne.x < 1){ playerOne.x = 20;}
                if(playerOne.y < 1){ playerOne.y = 20;}
                if(playerOne.x > 749){ playerOne.x = 730;}
                if(playerOne.y > 749){ playerOne.y = 730;}
                indicateMapCollision();
                $(playerOne.id).stop();
                $(playerOne.id).animate({ left: playerOne.x+"px",top:playerOne.y+"px" });
                addPlayerText($(playerOne.id),getRandomCurseWord());
                //console.log( playerOne.name, " is out of the map!");
                addNoty( `${ playerOne.name } is out of the map!` );
            }
        }
        if(playerTwo.isAlive){
            if( playerTwo.x < 0 || playerTwo.y < 0 || playerTwo.y > 750 || playerTwo.x > 750 ){
                if(playerTwo.x < 1){ playerTwo.x = 20;}
                if(playerTwo.y < 1){ playerTwo.y = 20;}
                if(playerTwo.x > 749){ playerTwo.x = 730;}
                if(playerTwo.y > 749){ playerTwo.y = 730;}
                indicateMapCollision();
                $(playerTwo.id).stop();
                $(playerTwo.id).animate({ left: playerTwo.x+"px",top:playerTwo.y+"px" });
                addPlayerText($(playerTwo.id),getRandomCurseWord());
                //console.log( playerTwo.name, " is out of the map!");
                addNoty( `${ playerTwo.name } is out of the map!` );
            }
        }
    }
}

var lastMobPlayerOverlapCheckMS = 0;
function checkMobCollision(){
    let now = new Date().getTime();
    if( now - lastMobPlayerOverlapCheckMS >= 100 ){
        lastMobPlayerOverlapCheckMS = now;
        $('.mob').each(function(i, obj) {
            if(playerOne.isAlive){
                if( playerOverlaps( $(playerOne.id), $(this)) ){
                    //console.log(playerOne.name, " hit by ", $(this).attr("name") );
                    addNoty(` ${playerOne.name} hit by ${$(this).attr("name")} `);
                    playSound("ouch");
                    damagePlayer(playerOne,$(this));
                }
            }
            if(playerTwo.isAlive){
                if( playerOverlaps( $(playerTwo.id), $(this)) ){
                    //console.log(playerTwo.name, " hit by ", $(this).attr("name") );
                    addNoty(` ${playerTwo.name} hit by ${$(this).attr("name")} `);
                    playSound("ouch");
                    damagePlayer(playerTwo,$(this));
                }
            }
        });
    }
}

var moveCharacter = function(dx, dy, player, otherPlayer, playerLastPos){
    player.x += (dx||0) * player.moveStep;
    player.y += (dy||0) * player.moveStep;
    $(player.id).css( {left: player.x + "px",top: player.y + "px"} );
    if(otherPlayer.isAlive){
        if( playerOverlaps( $(player.id), $(otherPlayer.id)) ){
            $(player.id).css("border","2px solid red");
            setTimeout(() => {
                $(player.id).css("border","1px solid");
            }, 500);
            $(player.id).stop();
            $(player.id).animate({ left: playerLastPos.left+"px",top:playerLastPos.top+"px" });
            pushByMoveOtherPlayer(player,otherPlayer);
        }
    }
};


var detectCharacterMovement = function(){

    if(playerOne.isAlive){
        if ( playerOnekeys[playerOnekeys.LEFT] ) {
        moveCharacter(-1, 0, playerOne, playerTwo, {left:playerOne.x,top:playerOne.y});
        }
        if ( playerOnekeys[playerOnekeys.RIGHT] ) {
        moveCharacter(1, 0, playerOne, playerTwo, {left:playerOne.x,top:playerOne.y});
        }
        if ( playerOnekeys[playerOnekeys.UP] ) {
        moveCharacter(0, -1, playerOne, playerTwo, {left:playerOne.x,top:playerOne.y});
        }
        if ( playerOnekeys[playerOnekeys.DOWN] ) {
        moveCharacter(0, 1, playerOne, playerTwo, {left:playerOne.x,top:playerOne.y});
        }
        if ( playerOnekeys[playerOnekeys.ATTACK] ) {
            attack(playerOne, playerTwo);
        }
    }

    if(playerTwo.isAlive){
        if ( playerTwokeys[playerTwokeys.LEFT] ) {
            moveCharacter(-1, 0, playerTwo, playerOne, {left:playerTwo.x,top:playerTwo.y});
        }
        if ( playerTwokeys[playerTwokeys.RIGHT] ) {
            moveCharacter(1, 0, playerTwo, playerOne, {left:playerTwo.x,top:playerTwo.y});
        }
        if ( playerTwokeys[playerTwokeys.UP] ) {
            moveCharacter(0, -1, playerTwo, playerOne, {left:playerTwo.x,top:playerTwo.y});
        }
        if ( playerTwokeys[playerTwokeys.DOWN] ) {
            moveCharacter(0, 1, playerTwo, playerOne, {left:playerTwo.x,top:playerTwo.y});
        }
        if ( playerTwokeys[playerTwokeys.ATTACK] ) {
            attack(playerTwo, playerOne);
        }
    }
};


var playerOverlaps = (function () {
    function getPositions( elem ) {
        var pos, width, height;
        pos = $( elem ).position();
        width = $( elem ).width();
        height = $( elem ).height();
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
    }

    function comparePositions( p1, p2 ) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function ( a, b ) {
        var pos1 = getPositions( a ),
            pos2 = getPositions( b );
        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
    };
})();

// Game loop
setInterval(function(){
    if( !gameStop ){
        detectCharacterMovement();
        checkPowerUpCollision();
        checkMapCollision();
        spawnRandomMob();
        checkMobCollision();
        moveMobs();
    }
    displayPlayerStats();
}, 1000/FPS);