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

});