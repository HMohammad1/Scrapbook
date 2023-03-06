$(document).ready(function(){


    $("body").on("click", ".req-btn", function(){

        $(".prog-bar").addClass("loading");

        reqID = $(this).attr("id");
        btn = $(this);

        if($(this).hasClass("accept")){
            newStatus = 1
        }
        else if ($(this).hasClass("decline")){
            newStatus = 0
        }
        else{
            // tampering somewhere -- just return
            return;
        }

        // post request
        $.post("/API/updateRequest", {reqID: reqID, status: newStatus}, function(data, textStatus, xhr){

            $(".prog-bar").removeClass("loading");

            if(xhr.status == 200){

                if(newStatus == 1){
                    btn.parent(".req-btns").html("Request Accepted");
                }
                else{
                    btn.parent(".req-btns").html("Request Declined");
                }
            }
            else{
                console.log(xhr);
                btn.parent(".req-btns").html("Oops something went wrong...");
            }

        });




    });






});