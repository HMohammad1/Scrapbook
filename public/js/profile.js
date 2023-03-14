var overlayed = false;

$(document).ready(function(){

    // get userID
    userID = $(".posts-holder").attr("ID");

    $(".prog-bar").addClass("loading");

    // $.get(`/API/posts/${userID}`, function(data, textStatus, xhr){

    //     $(".prog-bar").removeClass("loading");

    //     if(xhr.status === 200){
    //         $(".posts-holder").html(data);
    //         // update visibility after posts loaded
    //         updateLocation();

    //         // open a post if one was open
    //         openPost = $(".posts-holder").attr("data-openpost");
    //         if(openPost !== undefined){
    //             overlayed = true;
    //             $(`.post-icon#${openPost}`).trigger("click");
    //         }

    //     }
    //     else{
    //         console.log(xhr);
    //     }
    // });

    $.get(`/API/getCounts/${userID}`, function(data, textStatus, xhr){

        if(xhr.status == 200){
            $("#friends-counter").prepend(data[0] + " ");
            $("#posts-counter").prepend(data[1] + " ");
        }
        else{
            console.log(textStatus);
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

    $("body").on("click", ".buttonStyles", function(){

        $(this).addClass("selected");
    
    });
    
    disp="";
    bio="";
    $("body").on("click", "#profileButton", function(){
    
        $(this).attr("id", "save-btn");
    
        // change display / bio to inputs
        disp = $("#disp-name").text();
        $("#disp-name").html(`<input id="new-disp" class="form-control" placeholder="${disp}"/>`);
    
        bio = $("#bio").text();
        $("#bio").html(`<textarea class="form-control" id="new-bio" placeholder="${bio}"></textarea>`);
    
    
    });
    
    
    $("body").on("click", "#save-btn", function(){
    
        newBio = $("#new-bio").val();
        newDisp = $("#new-disp").val();
        newColour = $(".buttonStyles.selected").attr("id");

        btn = $(this);
        btn.html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...`);
    
        $.post("/API/updateProfile", {newBio: newBio, newDisp: newDisp, newColour: newColour}, function(data, textStatus, xhr){

            if(xhr.status == 200){
                btn.html("Edit Profile");
                btn.attr("id", "profileButton");

                $("#bio").html(`<p> ${data[0]}</p>`);
                $("#disp-name").html(`<h2>${data[1]}</h2>`);
            }
            else{
                btn.html("Something went wrong. Please try again later");
            }
        });
    });

});



function myFunction() {
    if (document.getElementById('myDIV2')) {

        if (document.getElementById('myDIV2').style.display === 'none') {
            document.getElementById('myDIV2').style.display = 'block';
            document.getElementById('myDIV3').style.display = 'none';
        }
        else {
            document.getElementById('myDIV2').style.display = 'none';
            document.getElementById('myDIV3').style.display = 'block';
        }
    }


}

function change()
{
    var btn = document.getElementById("profileButton");
    if (document.getElementById("profileButton").innerHTML === 'Edit Profile') {
        btn.innerHTML = 'Save Changes';
    } else {
        btn.innerHTML = 'Edit Profile';
    }


}