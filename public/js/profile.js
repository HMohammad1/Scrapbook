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

    $.get(`/API/getCounts/${userID}`, function(data, textStatus, xhr){

        if(xhr.status == 200){
            $("#friends-counter").prepend(data[0] + " ");
            if(data[0] > 1){
                $("#friends-counter").append('s');
            }
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
        
        // close any open posts
        if($(".map-overlay").length){
            // remove open post
            $(".map-overlay .post-holder").fadeOut(400, function(){
                $(this).remove();
            });
        }
        else{
            $(`<div class="map-overlay">`).insertBefore("#map");
        }

        $(".map-overlay").html(` <div class="spinner-border text-light" role="status">
        <span class="sr-only">Loading Post...</span>
      </div>`);

        $.get(`/API/post/${postID}`, function(data, textStatus, xhr){

            // OK
            if(xhr.status == 200){
                $(".map-overlay").html($(data));

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
                console.log(xhr);
            }
            // doesn't exist
            else if(xhr.status == 404){
                console.log(xhr);
            }
            // other error
            else{
                console.log(xhr);
            }

        });
    });

    $("body").on("click", ".buttonStyles", function(){

        $(this).addClass("selected");
    
    });
    
    disp="";
    bio="";
    src="";
    $("body").on("click", "#profileButton", function(){
    
        $(this).attr("id", "save-btn");
    
        // change display / bio to inputs
        disp = $("#disp-name").text();
        $("#disp-name").html(`<input id="new-disp" class="form-control" placeholder="${disp}"/>`);
    
        bio = $("#bio").text();
        $("#bio").html(`<textarea class="form-control" id="new-bio" placeholder="${bio}"></textarea>`);

        // add file input for pfp
        // get src for existing img
        src = $(".profile-icon2").attr("src");
        // change to input
        $("#pfp-holder").html(`<input type="file" accept"image/*" class="centre" id="newPFP" name="newPFP" />`);
        // set background img
        $("#newPFP").css("background-image", `url('${src}')`);
    
    
    });
    
    // change file bg on change
    $("body").on("change", "#newPFP", function(){
        file = this.files[0];
        fr = new FileReader();
        // once file read change bg img
        fr.onloadend = function(){
            $("#newPFP").css("background-image", `url('${fr.result}')`);
        }
        if(file){
            fr.readAsDataURL(file);
        }
        else{
            alert("something went wrong");
        }
    });

    
    $("body").on("click", "#save-btn", function(){

        profileForm = new FormData();

        profileForm.append("newBio", $("#new-bio").val());
        profileForm.append("newDisp", $("#new-disp").val());
        profileForm.append("newColour", $(".buttonStyles.selected").attr("id"));

        newPFP = $("#newPFP").prop("files")[0];
        profileForm.append("newPFP", newPFP);

        btn = $(this);
        btn.html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...`);
    
         $.ajax({
            url: '/API/updateProfile',
            dataType: 'JSON',
            cache: false,
            contentType: false,
            processData: false,
            data: profileForm,
            type: 'post',
            success: function (data, status, xhr) {

                btn.html("Edit Profile");
                btn.attr("id", "profileButton");

                document.getElementById('myDIV2').style.display = 'block';
                document.getElementById('myDIV3').style.display = 'none';

                $("#pfp-holder").html(`<img src="${data[2]}" class="profile-icon2 centre">`)
                $("#bio").html(`<p> ${data[0]}</p>`);
                $("#disp-name").html(`<h2>${data[1]}</h2>`);

            },
            error: function (data, status, xhr) {
                
                $("#bio").html(`<p> ${bio}</p>`);
                $("#disp-name").html(`<h2>${disp}</h2>`);

                btn.html("Something went wrong. Please try again later");

                document.getElementById('myDIV2').style.display = 'block';
                document.getElementById('myDIV3').style.display = 'none';

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