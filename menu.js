function initMenu(){
    initButtonEvents();
}

function initButtonEvents(){
    $(".menuButton").on("click", function () {
        if( $(this).hasClass("localPlay") ){
            $(".mapCover").hide("slow",function(){
                gameStop = false;
            });
        }else if( $(this).hasClass("singlePlayer") ){

        }else if( $(this).hasClass("multiPlayer") ){

        }else if( $(this).hasClass("settings") ){
            
        }
    });
}