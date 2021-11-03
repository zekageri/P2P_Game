function initSounds(){

}
var sounds = {
    nextRound   : new Audio("nextRound.wav"),
    miss        : new Audio("missHit.wav"),
    hit         : new Audio("hit.wav"),
    ouch        : new Audio("ouch.wav"),
};

function playSound(soundElem){
    if(!sounds[soundElem].paused) sounds[soundElem].pause();
    sounds[soundElem].currentTime = 0;
    sounds[soundElem].play();
}