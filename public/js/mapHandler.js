// 15s between updates
var updateWindow = 2000;
var updateTimer, onLoadLocationTimer;

//const postDAO = require ('../../DAOs/postDAO.js');

// global variable to store coords position
var pos = [0, 0];
var map, markClust, markersArr, marker;

var notLoadMap = 0;

var userMarker = null, userCircle = null;

var posts = [];
var postsArray = [];


var loadedOnce = 0;



currentLocation();

// Function to find current location
function currentLocation() {

    // navigator.geolocation.getCurrentPosition options to improve accuracy
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

    
    // success function if api found location
    const success = (position) => {
        
        // constants to store latitude and longitude
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // variable to store location data in a empty object
        var location = {lat: latitude, lng: longitude};

        // initialize position variable
        pos = [];

        // push coords to position variable
        pos.push(position.coords.latitude);
        pos.push(position.coords.longitude);

        /* if (loadedOnce == 0) {
            
            location = {lat: 55.9115, lng: -3.32047};
        } */

        
        
        updateCurrentLocationMarker(location);
        createLocationCircle(location);

        

        //updateMarkers(location);

        
        
        //removeMarkers();
        
        
        //console.log("HELLO");
        //initMap(location);
        
    };

    // error function if location not found
    const error = () => {
        console.log('Unable to retrieve location');
        
    };

    // function from geolocation api to get current position
    navigator.geolocation.getCurrentPosition(success, error, options);

}




function getPosts(callback) {

    $.get(`/API/getAllPosts`, function(data, textStatus, xhr){
        if(xhr.status == 200){
            //console.log(data);
            
            
            //posts = data;
            if (posts.length != data.length) {
                //console.log(data);
                data.forEach(element => {

                    if (!posts.includes(element)) {
                        posts.push(element);
                    }

                    
                });

                return(callback(null, posts));
            }
        }
        else{
            console.log(textStatus);
            return(callback(true, null));
        }
    }) 
}

/* var posts = [{location: {lat: 55.955330274019374, lng:-3.1886875079554837}},
        {location: {lat: 55.95045275244971, lng: -3.1883441852294623}},
        {location: {lat: 55.95131777646914, lng: -3.1954681317944087}},
        {location: {lat: 55.952615276150276, lng: -3.193193619156272}}]; */

function returnPosts() {

    //console.log(posts);
    return posts;
}

function updateCurrentLocationMarker(location) {

    if (userMarker) {
        userMarker.setMap(null);
        userMarker = null;
    }

    userMarker = new google.maps.Marker({
        position: location,
        map: map,
        icon: '../images/svg_markers/marker-user.svg'
    });

    //return userMarker;
}

function createLocationCircle(location) {

    if (userCircle) {
        userCircle.setMap(null);
        userCircle = null;
    }

    userCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: "#F7A6A6",
        fillOpacity: 0.35,
        map,
        center: location,
        radius: 50
    });

    //return locCircle;
}


function updateMarkers(location) {
    posts = [] //getPosts();

    removeMarkers();
    
    markersArr = [];

    // loop through each item in marker array, create the marker and append it to the markers array
    for (let i = 0; i < posts.length; i++) {
        markersArr.push(addMarker(posts[i], location));
    };

    // create the marker cluster
    markClust = new markerClusterer.MarkerClusterer({ markers: markersArr, map });

}

function addMarker(posts, location){

    

    marker = null;

    // if distance of location is over 50m of the current location then the marker is grey
    if (over50(posts, location)) {
        marker = new google.maps.Marker({
            position: posts.location,
            map: map,
            icon: '../images/svg_markers/marker-dgrey.svg'
        });

        // else marker is blue if within 50m
    } else {
        marker = new google.maps.Marker({
            position: posts.location,
            map: map,
            icon: '../images/svg_markers/marker-blue.svg'
        });
    }

    return marker
}












// function to return position
function getPosition() {
    return pos;
}



// function to pan to current location
function panToCurLoc(){
    var location = {lat: getPosition()[0], lng: getPosition()[1]};

    map.panTo(location);
}

// function to remove markers
function removeMarkers() {


    if (markersArr != undefined) {
        markClust.removeMarkers(markersArr);

        for (var i = 0; i<markersArr.length; i++) {
            markersArr[i].setMap(null);
        }
    }

    markersArr = [];
    
}

// Function to check if the location is over 50 metres from current location
function over50(property, currentLocation) {

    //console.log(currentLocation.lat);
    // get distance between point 1 and point 2
    var distance = getDistanceFromLatLonInM(currentLocation.lat, currentLocation.lng, property.coords[0], property.coords[1]);
    
    // if distance is over 50 metres return true else return false
    if (distance > 50) {
        return true;
    }

    return false;
}





// function to initialize the map
function initMap() {

    if (notLoadMap <= 2) {
        onLoadLocationTimer = setTimeout(initMap, 1);
        notLoadMap++;
    }

    
    

    // if no location parameter is passed in then use default location
    var location = {lat: getPosition()[0], lng: getPosition()[1]};

    //console.log(location);


    // create map with location and map style
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: location,
        mapId: '4a11e687fb2c35f2',
        disableDefaultUI: true
    });

    getPosts(function(err, result)  {
        if(!err) {

            //setTimeout(initializeMarkers, 8000);
            
            //console.log(result);

            initializeMarkers();

            // Create the DIV to hold the control.
            const centerControlDiv = document.createElement("div");
            // Create the control.
            const centerControl = createCenterControl(map);

            // Append the control to the DIV.
            centerControlDiv.appendChild(centerControl);
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
        }
    
    });


    // function to add a marker
    function addMarker(postObject, permsArr) {
        

        // initialize marker
        var marker = null;

        var coords = {lat: postObject.coords[0], lng: postObject.coords[1]};

    

        //console.log(MarkerArray.length);
        
        // if distance of location is over 50m of the current location then the marker is grey
        if (over50(postObject, location)) {
            marker = new google.maps.Marker({
                position: coords,
                map: map,
                icon: '/images/svg_markers/marker-dgrey.svg'
            });

            // else marker is blue if within 50m
        } else {
            marker = new google.maps.Marker({
                position: coords,
                map: map,
                icon: '/images/svg_markers/marker-blue.svg'
            });
        }
        
        /* marker = new google.maps.Marker({
            position: coords,
            map: map,
            icon: '../images/svg_markers/marker-dgrey.svg',
            id: postObject.postID
        }); */

        //console.log(postObject);

        const detailWindow = new google.maps.InfoWindow({
            // content: "testing123"
            content: postObject.HTML
        })

        // on mouse over display detail window 
        marker.addListener("click", () => {
            detailWindow.open(map, marker);
        });
    
        // on mouse off un display it
        marker.addListener("", () => {
            detailWindow.close(map, marker);
        });

        
        // return the created marker for marker cluster
        return marker;
        
    }



    

    function initializeMarkers() {

        MarkerArray = returnPosts();

        console.log(MarkerArray);


        //console.log(MarkerArray.length);

        /* MarkerArray.forEach(element => {
            if (postsArray.length != MarkerArray.length){
                postsArray.push(element.postID);
            };
            
        }) */

        

        


        // markers array to store created markers for the marker cluster
        markersArr = [];

        // loop through each item in marker array, create the marker and append it to the markers array
        for (let i = 0; i < MarkerArray.length; i++) {
            markersArr.push(addMarker(MarkerArray[i]));
        };
        

       
        updateCurrentLocationMarker(location);
        createLocationCircle(location);

        // create the marker cluster
        markClust = new markerClusterer.MarkerClusterer({ markers: markersArr, map });
    }

}

function getPermsArray(postsIDArray) {
    $.get('/API/updateMap', function(data, textStatus, xhr){
        if(xhr.status == 200){
            //console.log(data);
            
            //permsArray = data;

            //console.log(data);
            
            data.forEach(element =>  {
                postsArray.push(element);
            });
            
            return postsArray;
            
        }
        else{
            console.log(textStatus);
        }
    }) 
}

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


function updatePost(postID, perm){


    // get post object
    post = $(`#${postID}`);

    // if allowed to view
    if(perm){

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


// 
function updateLocation(){

    // TESTING COORDS -- MAPS API OUTPUT GOES HERE
    /* newLat = 55.9091;
    newLong = -3.31959; */
    currentLocation();
    newLat = getPosition()[0];
    newLong = getPosition()[1];



    $.post("/API/updateLocation", {lat: newLat, long: newLong}, function(data, textStatus, xhr){

        // reset the timer
        updateTimer = setTimeout(updateLocation, updateWindow);

        // error check -- only update visibility when success
        if(xhr.status == 200){

            // init array for holding postIDs
            var postIDs = [];
            // this will only get icons on screen at the time
            // NEEDS EXPANDED FOR MAP MARKERS
            $(".post-icon").each(function(){

                postID = $(this).attr("id");
                // ID could already be in as 
                if(!postIDs.includes(postID)){
                    postIDs.push(postID);
                }

            });
            // send new call for post perms
            $.get("/API/updateMap", {postIDs: postIDs}, function(data, textStatus, xhr){

                if(xhr.status == 200){

                    for(i=0; i<data.length; i++){
                        updatePost(data[i][0], data[i][1]);
                    }
                }
                else{
                    console.log(xhr);
                }
            });
        }

    });

};

$(document).ready(function(){

    

    // set location after page load
    updateLocation();

    //console.log(getPosts());

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

});

function createCenterControl(map) {
    const controlButton = document.createElement("button");

    // Set CSS for the control.
    controlButton.style.backgroundColor = "#fff";
    controlButton.style.border = "2px solid #fff";
    controlButton.style.borderRadius = "3px";
    controlButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlButton.style.color = "rgb(25,25,25)";
    controlButton.style.cursor = "pointer";
    controlButton.style.fontFamily = "Roboto,Arial,sans-serif";
    controlButton.style.fontSize = "16px";
    controlButton.style.lineHeight = "38px";
    controlButton.style.margin = "8px 0 22px";
    controlButton.style.padding = "0 5px";
    controlButton.style.textAlign = "center";
    controlButton.textContent = "Current Location";
    controlButton.title = "Click to go to current location the map";
    controlButton.type = "button";
    // Setup the click event listeners: simply set the map to Chicago.
    controlButton.addEventListener("click", () => {
        //map.setCenter(panToCurLoc());
        panToCurLoc();
    });
    return controlButton;
}



// ----------------------- OLD CODE -----------------------------


// if distance of location is over 50m of the current location then the marker is grey
        /* marker = new google.maps.Marker({
            position: postObject.
        }) */
        

        /* // initialize marker
        var marker = null;

        // if distance of location is over 50m of the current location then the marker is grey
        if (over50(property, location)) {
            marker = new google.maps.Marker({
                position: property.location,
                map: map,
                icon: '../images/svg_markers/marker-dgrey.svg'
            });

            // else marker is blue if within 50m
        } else {
            marker = new google.maps.Marker({
                position: property.location,
                map: map,
                icon: '../images/svg_markers/marker-blue.svg'
            });
        } */


        /* // if property does have content, i.e. marker text
        if (property.content) {

            // create new detail window with content
            const detailWindow = new google.maps.InfoWindow({
                content: property.content
            });

            //detailWindow.open(map, marker);
            // on mouse over display detail window 
            marker.addListener("click", () => {
                detailWindow.open(map, marker);
            });
        
            // on mouse off un display it
            marker.addListener("mouseout", () => {
                detailWindow.close(map, marker);
            });
        }
         */






        // marker array to store marker data
        /* MarkerArray = [
            //{location:location, content: '<h2>You are here!</h2>'}, 
            {location: {lat: 55.91329, lng: -3.32156}}, 
            {location: {lat: 55.9118, lng: -3.3215}}, 
            {location: {lat: 55.9109, lng: -3.3215}, content: '<h2>Heriot watt campus</h2>'}, 
            {location: {lat: 55.9113, lng: -3.32}},
            // town
            {location: {lat: 55.955330274019374, lng:-3.1886875079554837}},
            {location: {lat: 55.95045275244971, lng: -3.1883441852294623}},
            {location: {lat: 55.95131777646914, lng: -3.1954681317944087}},
            {location: {lat: 55.952615276150276, lng: -3.193193619156272}},
            // meadows
            {location: {lat: 55.941777434166006, lng: -3.191200531846362}},
            {location: {lat: 55.94029930899516, lng: -3.187595643223136}},
            {location: {lat: 55.940767988893164, lng: -3.1867158784710568}}
        ]; */