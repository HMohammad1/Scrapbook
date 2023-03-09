$(document).ready(function(){

    // get userID
    userID = $(".posts-holder").attr("ID");

    $(".prog-bar").addClass("loading");

    $.get(`/API/posts/${userID}`, function(data, textStatus, xhr){

        $(".prog-bar").removeClass("loading");

        if(xhr.status === 200){
            $(".posts-holder").html(data);
            // update visibility after posts loaded
            updateLocation();

            // open a post if one was open
            openPost = $(".posts-holder").attr("data-openpost");
            console.log(openPost);
            if(openPost !== undefined){
                $(`.post-icon#${openPost}`).trigger("click");
            }

        }
        else{
            console.log(xhr);
        }
    });

    $("body").on("click", ".map-overlay", function(){
        $(this).fadeOut(400, function(){
            $(this).remove();
        });

    })


    // open a post in the full overlay
    $("body").on("click", ".post-icon:not(.disabled)", function(){

        // get id
        postID = $(this).attr("ID");

        // close any open overlays
        $(".map-overlay").fadeOut(400, function(){
            $(this).remove();
        });

        $.get(`/API/post/${postID}`, function(data, textStatus, xhr){

            // OK
            if(xhr.status == 200){
                $(data).insertBefore("#map");
                // update history
                stateObj = {id : navcounter++};
                newURL = window.location.href.replace(/\/[^\/]*$/, `/${postID}`);
                window.history.pushState(stateObj, "Scrapmap", newURL);
                
                // change open post
                $(".posts-holder").attr("data-openpost", postID);

            }
            // out of range
            else if(xhr.status == 403){

            }
            // doesn't exist
            else if(xhr.status == 404){

            }
            // other error
            else{

            }

        });
    });

});