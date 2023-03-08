// 15s between updates
var updateWindow = 15000;
var updateTimer;

function getDistanceFromLatLonInM(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d*1000; // convert to m and return
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }


  function updatePost(post, userLat, userLong){

    // get post coords
    postLat = post.attr("data-lat");
    postLong = post.attr("data-long");

    // calc distance and enable / disable
    if(getDistanceFromLatLonInM(userLat, userLong, postLat, postLong) <= 50){

        // if not already enabled
        if(post.hasClass("disabled")){
            post.removeClass("disabled");
        }
    }
    else{

        // if not already disabled
        if(!post.hasClass("disabled")){
            post.addClass("disabled");
        }
    }
  }


  function updateLocation(){

    // TESTING COORDS -- MAPS API OUTPUT GOES HERE
    newLat = 55.9091;
    newLong = -3.31959;

    $.post("/API/updateLocation", {lat: newLat, long: newLong}, function(data, textStatus, xhr){

        // reset the timer
        updateTimer = setTimeout(updateLocation, updateWindow);

        // error check -- only update visibility when success
        if(xhr.status == 200){

            // for each post one check the distance and set accordingly
            $(".post-icon").each(function(){

                updatePost($(this), newLat, newLong);

            });

        }

    });

};

$(document).ready(function(){

    // set location after page load
    updateLocation();

});