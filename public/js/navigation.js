// global for holding menu status
menuOpen = true;

$(document).ready(function(){

    $("body").on("click", ".menu-togg", function(){

        // slide menu off
        if(menuOpen){
            $(".sidebar").animate({right: "100vw"}, 400, function(){
                $(".sidebar").hide();
            });
            menuOpen = false;
        }
        else{
            $(".sidebar").show();
            $(".sidebar").animate({right: "0vw"}, 400, function(){
                menuOpen=true;
            });
        }

    });

    $("body").on("click", "a, button, .menu-item", function(){

        $(".prog-bar").animate({width: "100%"}, 400, "linear");

    })


    $("body").on("click", ".menu-item", function(){

        item = $(this).id();
        

    });






})