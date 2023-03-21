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


    // change radio text on click
    $("input[name='allow-comments']").change(function(){
        if($(this).is(":checked")){
            $("#ac-text").text("Allow comments");
        }
        else{
            $("#ac-text").text("Do not allow comments");
        }
    });

    $("input[name='allow-reactions']").change(function(){
        if($(this).is(":checked")){
            $("#ar-text").text("Allow reactions");
        }
        else{
            $("#ar-text").text("Do not allow reactions");
        }
    });

    $("input[name='post-vis']").change(function(){
        if($(this).is(":checked")){
            $("#pv-text").text("Visibility: Public");
        }
        else{
            $("#pv-text").text("Visibility: Friends Only");
        }
    });




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

                // remove the input holder from the carousel
                $(".input-holder").removeClass("carousel-item");
                $(".input-holder").removeClass("active");
                $(".input-holder").hide();

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
                                <div class="upload-preview" id=${i+1} style="height: 300px;"></div>
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
        $(".input-holder").addClass("carousel-item");
        $(".input-holder").addClass("active");
        $(".input-holder").show();

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
        formData.append('title', $("#postTitle").val());
        formData.append('description', $("#descr").val());


        formData.append('allowComments',$("input[name='allow-comments']").is(":checked"));
        formData.append('allowReacts', $("input[name='allow-reactions']").is(":checked"));
        formData.append('public', $("input[name='post-vis']").is(":checked"));
        
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

//  function onFileSelected(event) {
//      var inp = document.getElementById('postImg');
//      for (var i = 0; i < inp.files.length; ++i) {

//          const selectedFile = event.target.files[i];
//          const reader = new FileReader();
//          const imgtag = document.getElementById(i.toString());
//          imgtag.title = selectedFile.name;
//          reader.onload = function (event) {
//              imgtag.src = event.target.result;
//          };
//          reader.readAsDataURL(selectedFile);
//          // var name = inp.files.item(i).name;
//          // alert("here is a file name: " + name);
//      }
//  }