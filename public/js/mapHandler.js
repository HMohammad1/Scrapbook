// 15s between updates
var updateWindow = 15000;
var updateTimer;
const met50 = 0.0004505;

// global variable to store coords position
var pos = [0, 0];

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


        initMap(location);
        
    };

    // error function if location not found
    const error = () => {
        alert('Unable to retrieve location');
        
    };

    // function from geolocation api to get current position
    navigator.geolocation.getCurrentPosition(success, error, options);

}

// function to return position
function getPosition() {
    return pos;
}

// function to initialize the map
function initMap(location) {

    // if no location parameter is passed in then use default location
    if (!location) {
        var location = {lat: 55.911328751879964, lng: -3.321574542053874};
    }


    // create map with location and map style
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: location,
        mapId: '4a11e687fb2c35f2'
    });

    
    // function to add a marker
    function addMarker(property) {

        // initialize marker
        var marker = null;

        // if distance of location is over 50m of the current location then the marker is grey
        if (over50(property, location)) {
            marker = new google.maps.Marker({
                position: property.location,
                map: map,
                icon: '../images/map_markers/marker-dgrey.png'
            });

            // else marker is blue if within 50m
        } else {
            marker = new google.maps.Marker({
                position: property.location,
                map: map,
                icon: '../images/map_markers/marker-blue.png'
            });
        }


        // if property does have content, i.e. marker text
        if (property.content) {

            // create new detail window with content
            const detailWindow = new google.maps.InfoWindow({
                content: property.content
            });

            // on mouse over display detail window 
            marker.addListener("mouseover", () => {
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

    

    // Function to check if the location is over 50 metres from current location
    function over50(property, currentLocation) {

        // get distance between point 1 and point 2
        var distance = Math.sqrt((Math.pow((currentLocation.lat - property.location.lat), 2)) + (Math.pow((currentLocation.lng - property.location.lng), 2)));
        
        // if distance is over 50 metres return true else return false
        if (distance > met50) {
            return true;
        }

        return false;
    }

    // marker array to store marker data
    MarkerArray = [
        {location:location, content: '<h2>You are here!</h2>'}, 
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
    markers = [];

    // loop through each item in marker array, create the marker and append it to the markers array
    for (let i = 0; i < MarkerArray.length; i++) {
        markers.push(addMarker(MarkerArray[i]));
    };


    // create the marker cluster
    new markerClusterer.MarkerClusterer({ markers, map });
    
    
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
    /* newLat = 55.9091;
    newLong = -3.31959; */
    currentLocation();
    newLat = getPosition()[0];
    newLong = getPosition()[1];

    /* console.log(newLat);
    console.log(newLong); */

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
    currentLocation();

    // set location after page load
    updateLocation();

});
