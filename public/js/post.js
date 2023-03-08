$(document).ready(function(){


    postID = $(".post-holder").attr("ID");

    $.get(`/API/postComments/${postID}`, function(data, textStatus, xhr){

        if(xhr.status == 200){
            $(".post-comments").html(data);
        }
        else if(xhr.status == 404){
            $(".post-comments").html("This post has no comments.");
        }
        else{
            console.log(xhr);
        }
    });


});