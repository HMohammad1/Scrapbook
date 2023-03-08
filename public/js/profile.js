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
        }
        else{
            console.log(xhr);
        }
    });


    // open a post in the full overlay
    $("body").on("click", ".post-icon:not(.disabled)", function(){

        // get id
        postID = $(this).attr("ID");

        // close any open overlays
        $(".map-overlay").fadeOut(400, function(){
            $(".map-overlay").remove();
        });

        $.get(`/API/post/${postID}`, function(data, textStatus, xhr){

            // OK
            if(xhr.status == 200){
                $(data).insertBefore("#map");
                // load comments
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