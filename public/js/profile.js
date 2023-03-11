var overlayed = false;

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
            if(openPost !== undefined){
                overlayed = true;
                $(`.post-icon#${openPost}`).trigger("click");
            }

        }
        else{
            console.log(xhr);
        }
    });

    $("body").on("click", ".map-overlay", function(e){
        // check if bg clicked directly
        if(e.target !== this){
            return;
        }

        $(this).fadeOut(400, function(){
            $(this).remove();
            overlayed = false;
        });

    })


    // open a post in the full overlay
    $("body").on("click", ".post-icon:not(.disabled)", function(){

        // get id
        postID = $(this).attr("ID");

        // if on mobile close menu
        if($(window).width() <= 500){
            $(".nav-btn").trigger("click");
        }
        
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
                if(overlayed){
                    // replace postID in URL with new one
                    newURL = window.location.href.replace(/\/[^\/]*$/, `/${postID}`);
                }
                else{
                    // append postID to URL
                    newURL = `${window.location.href}/${postID}`;
                }

                window.history.pushState(stateObj, "Scrapmap", newURL);
                // change open post
                $(".posts-holder").attr("data-openpost", postID);

                // set overlayed
                overlayed = true;

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