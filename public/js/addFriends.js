//1.5 second timer
doneTyping = 1000;

$(document).ready(function(){

    // auto focus the input
    $("#addFriend").focus();

    var searchTimer;
    // reset timer on each keyup
    $("#addFriend").on("keyup", function(){
        clearTimeout(searchTimer);
        if($(this).val()){
            searchTimer = setTimeout(searchUsername, doneTyping);
        }
    });

    // search the username and return options
    function searchUsername(){

        // remove any old results
        $(".friend-result").remove();

        username = $("#addFriend").val();
        $(".prog-bar").addClass("loading");

        $.get(`/API/searchUsername/${username}`, function(data, textStatus, xhr){

            $(".prog-bar").removeClass("loading");

            if(xhr.status == 200){
                profiles = JSON.parse(data);
                if(profiles.length == 0){
                    console.log("no matches found");
                }
                else{
                    profiles.forEach(profile => {
                        $(".sidebar").append(`
                        <div class="row friend-result">
                            <img src="${profile.pfp}" class="profile-icon">
                            <span class="menu-text">${profile.username}</span>
                            <button class="btn send-btn" id="${profile.userID}"> Add Friend </button>
                        </div>`)
                    });
                }

            }
            else{
                console.log(textStatus);
            }

        });

    }

    // send a request
    $("body").on("click", ".send-btn", function(){

        btn = $(this);
        userID = $(this).attr("id");

        $(".prog-bar").addClass("loading");

        $.get(`/API/sendRequest/${userID}`, function(data, textStatus, xhr){

            $(".prog-bar").removeClass("loading");
            
            if(xhr.status == 200){
                btn.text("Request Sent");
                btn.attr("disabled", "disabled");
            }
            else{
                console.log(xhr);
            }


        });


    })


});