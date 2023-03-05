$(document).ready(function(){

    // swap active tabs
    $("body").on("click", ".tablinks:not(.active)", function(){

        $(".tablinks.active").removeClass("active");
        $(this).addClass("active");

        if($(this).hasClass("login")){

            $(".tabcontent").css("display", "none");
            $(".tabcontent#login").css("display","block");
        }
        else{
            $(".tabcontent").css("display", "none");
            $(".tabcontent#signup").css("display","block");
        }


    });



});