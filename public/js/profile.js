$(document).ready(function(){

    // get userID
    userID = $(".posts-holder").attr("ID");    

    $.get(`/API/posts/${userID}`, function(data, textStatus, xhr){

        if(xhr.status == 200){
            $(".posts-holder").html(data);
        }
        else{
            console.log(xhr);
        }
    });

});