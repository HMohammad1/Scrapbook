// 15s between updates
var updateWindow = 15000;
var updateTimer, onLoadLocationTimer;

//const postDAO = require ('../../DAOs/postDAO.js');

// global variable to store coords position
var pos = [0, 0];
var map, markClust, markersArr, marker;

var notLoadMap = 0;

var userMarker, userCircle;



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

        if (userMarker != undefined && userCircle != undefined) {
            userMarker.setMap(null);
            userCircle.setMap(null);
        }
        
        userMarker = updateCurrentLocationMarker(location);
        userCircle = createLocationCircle(location);

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




function getPosts() {
    posts = []
    $.get(`/API/getAllPosts`, function(data, textStatus, xhr){
        if(xhr.status == 200){
            console.log(data);
           posts = data;
        }
        else{
            console.log(textStatus);
        }
        
    })

    /* var posts = [{location: {lat: 55.955330274019374, lng:-3.1886875079554837}},
        {location: {lat: 55.95045275244971, lng: -3.1883441852294623}},
        {location: {lat: 55.95131777646914, lng: -3.1954681317944087}},
        {location: {lat: 55.952615276150276, lng: -3.193193619156272}}]; */
    
    console.log(posts);
    return posts;
}

function updateCurrentLocationMarker(location) {

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: '../images/svg_markers/marker-user.svg'
    });

    return marker;
}

function createLocationCircle(location) {

    var locCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: "#F7A6A6",
        fillOpacity: 0.35,
        map,
        center: location,
        radius: 50
    });

    return locCircle;
}


function updateMarkers(location) {
    var posts = getPosts();

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
    var distance = getDistanceFromLatLonInM(currentLocation.lat, currentLocation.lng, property.location.lat, property.location.lng);
    
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


    // create map with location and map style
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: location,
        mapId: '4a11e687fb2c35f2',
        disableDefaultUI: true
    });
    
    initializeMarkers();

    // Create the DIV to hold the control.
    const centerControlDiv = document.createElement("div");
    // Create the control.
    const centerControl = createCenterControl(map);

    // Append the control to the DIV.
    centerControlDiv.appendChild(centerControl);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);



    // function to add a marker
    function addMarker(property) {


        

        // initialize marker
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
        }


        // if property does have content, i.e. marker text
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
        
        // return the created marker for marker cluster
        return marker;
        
    }



    

    function initializeMarkers() {

       

        
        // marker array to store marker data
        MarkerArray = [
            /* {location:location, content: '<h2>You are here!</h2>'},  */
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
        ];


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
    //updateLocation();

    getPosts();

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