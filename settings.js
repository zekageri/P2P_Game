function initSettingsEvent(){
    nameChangeEvent();
}

var nameTimer;
function nameChangeEvent(){
    $(".playerOneName").on("input focus blur", function (e) {
        let evtType = e.type;
        if(evtType == "focus"){
            $(document).off("keydown keyup");
        }else if(evtType == "blur"){
            setKeyEvents();
        }else{
            clearTimeout(nameTimer);
            nameTimer = setTimeout(() => {
                let name = $(this).text();
                playerOne.name = name;
                addPlayerText($(playerOne.id),getRandomSuccessWord());
            }, 500);
        }
    });
    $(".playerTwoName").on("input focus blur", function (e) {
        let evtType = e.type;
        if(evtType == "focus"){
            $(document).off("keydown keyup");
        }else if(evtType == "blur"){
            setKeyEvents();
        }else{
            clearTimeout(nameTimer);
            nameTimer = setTimeout(() => {
                let name = $(this).text();
                playerTwo.name = name;
                addPlayerText($(playerTwo.id),getRandomSuccessWord());
            }, 500);
        }
    });
}