 var first = true;
 
 function addIMGPreview(file){
    // once file read add own input to carousel
    fr = new FileReader();
    fr.onloadend = function(){

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
        $(".carousel-inner").prepend(newPreview);
    }

    fr.readAsDataURL(file);
}


$(document).ready(function(){


    // hide carousel icons
    $(".carousel-control-next-icon, .carousel-control-prev-icon").hide();

    $(".multi-input").on("change", function(){

        if(this.files){
            if(this.files.length > 1){
                $(".carousel-control-next-icon, .carousel-control-prev-icon").show();
            }

            // remove existing children
            $(".carousel-item:not(.input-holder)").remove();

            // hide the multi input
            $("input.multi-input").parent(".carousel-item").removeClass("active");
            $("input.multi-input").parent(".carousel-item").hide();

            // add each file to the carousel
            Array.prototype.forEach.call(this.files, addIMGPreview);
        }
        else{

        }







    });
});