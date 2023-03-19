 var first = true;
 
 function addIMGPreview(file){
    // once file read add own input to carousel
    fr = new FileReader;
    fr.onloadend = function(e){

        newPreview = $(`
        <div class="carousel-item">
            <div class="upload-preview" style="height: 300px;"></div>
        </div>`
        );
        newPreview.children(".upload-preview").css("background-image", `url('${fr.result}')`);
        
        if(first){
            first = false;
            newPreview.addClass("active");
        }
        $(".carousel-inner").append(newPreview);
    }

    fr.readAsDataURL(file);
}


$(document).ready(function(){

    // hide carousel icons
    $(".carousel-control-next-icon, .carousel-control-prev-icon").hide();

    $(".multi-input").on("change", function(){

        // ignore when manually reset with btn
        if($(this).val()){
            if(this.files){

                // remove any alerts
                $(".img-alert").remove();

                if(this.files.length > 1){
                    if(this.files.length > 6){
                        $("#uploadPreviews").after($(`<div class="alert alert-danger img-alert" role="alert">
                        A post can only have up to 6 images. Please remove some and try again.
                        </div>`));
                        $(".post-btn").attr("disabled", "disabled");
                        $("#postImg").addClass("is-invalid");
                        return;
                    }
                    $(".carousel-control-next-icon, .carousel-control-prev-icon").show();
                }
                

                // remove existing children
                $(".carousel-item:not(.input-holder)").remove();

                // hide the multi input
                $("input.multi-input").parent(".carousel-item").removeClass("active");
                $("input.multi-input").parent(".carousel-item").hide();

                files = this.files;

                // add each file to the carousel
                Object.keys(files).forEach(i => {

                    var file = files[i];

                    // once file read add own input to carousel
                    var fr = new FileReader;
                    fr.onloadend = function(e){

                        if(fr.result){
                            newPreview = $(`
                            <div class="carousel-item">
                                <div class="upload-preview" style="height: 300px;"></div>
                            </div>`
                            );
                            newPreview.children(".upload-preview").css("background-image", `url('${fr.result}')`);
                            
                            if(first){
                                first = false;
                                newPreview.addClass("active");
                            }
                            $(".carousel-inner").append(newPreview);
                        }
                        else{
                            
                            $("#uploadPreviews").after($(`<div class="alert alert-danger img-alert" role="alert">
                                Something went wrong reading ${file.name}. Please try again later.
                            </div>`));
                            $("#postImg").addClass("is-invalid");
                            $(".post-btn").attr("disabled", "disabled");
                        }
                    }

                    fr.readAsDataURL(file);

                });

                // add clear img button
                $("#uploadPreviews").after($(`<button type="button" class="btn img-btn cancel">Remove Images</button>`));

            }
            else{

                $("#uploadPreviews").after($(`<div class="alert alert-danger img-alert" role="alert">
                Something went wrong reading your files. Please try again later.
                </div>`))

            }
        }
    });


    $("body").on("click", ".img-btn.cancel", function(){
        // remove any existing images
        $(".carousel-item:not(.input-holder)").remove();
        // reset file input values
        $("#postImg").val(null);
    
        // remove any alerts
        $(".img-alert").remove();

        // show the multi input
        $("input.multi-input").parent(".carousel-item").addClass("active");
        $("input.multi-input").parent(".carousel-item").show();

        // remove the button
        $(this).remove();

        // reset first
        first = true;

    });

    // try submitting with ajax
    $("#uploadBtn").click(function(){

        var formData = new FormData();

        // add each file to form
        files = $("#postImg").prop('files');
        for(i=0; i<files.length; i++){
            formData.append(`img${i}`, files[i], files[i].name);
        }

        // add title and description
        formData.append('title', $("#title").val());
        formData.append('description', $("#descr").val());
        
        $.ajax({
            url: `/API/upload`, 
            type: "POST",
            dataType: "text",
            contentType: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            processData: false,
            contentType: false,
            data: formData,
        }).done(function(data, textStatus, xhr){

            if(xhr.status == 200){
                window.location.replace(data);
            }
            else{
                window.alert("Something went wrong!");
            }
        });



    });

});