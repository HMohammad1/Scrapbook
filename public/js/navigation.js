// global for holding menu status
menuOpen = true;
navcounter = 1;

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

    $("body").on("click", "a, #submit, .menu-item", function(){

        $(".prog-bar").animate({width: "100%"}, 400, "linear");

    })


    $("body").on("click", ".menu-item", function(){

        // get ID 
        menu = $(this).attr("id");
        text = $(this).children(".menu-text").text();

        $.get(`/API/${menu}`, function(data, textStatus, xhr){

            $(".prog-bar").css("width", "0px");

            // error check
            if(xhr.status == 200){
                $(".sidebar").html(data);
            }

            // update history
            stateObj = {id : navcounter++};
            window.history.pushState(stateObj, text, `/${menu}`);

        });
    });






})