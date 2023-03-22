// sets range for posts to be viewable
const POST_RANGE = 50;

const mapDAO = require('../DAOs/mapDAO.js');
const postServices = require('./postServices.js');

var User = require ('../objects/user.js');
var Profile = require ('../objects/profile.js');
var Post = require('../objects/post.js');

// update the user's location
const updateLocation = (req,res) =>{

    // check user is logged in
    if(typeof(req.session.user) !== 'undefined'){

        // this is janky as fuck
        var user = Object.assign(new User(), req.session.user);
        user.updateCoords(req.fields.lat, req.fields.long);
        req.session.user = user;

        res.status(200);
        return res.send();
    }
    else{
        res.status(403);
        return res.send();
    }

}

const getUserLocation = (req, res) =>{

    // check user is logged in
    if(typeof(req.session.user) !== 'undefined'){
        res.status(200);
        return res.send(req.session.user.getCoords());
    }
    else{
        res.status(403);
        return res.send();
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


// tests if a user is within viewing range or not
function withinRange(userCoords, postCoords){

    delta = getDistanceFromLatLonInM(userCoords[0], userCoords[1], postCoords[0], postCoords[1]);
    if(delta <= POST_RANGE){
        return true;
    }
    else{
        return false;
    }
}




// get all on screen postIDs
// check perms
// assign to array with relevant perm
// return array to client
// client sorts classes depending on perms in array
const updateMap = (req, res) =>{

    // only run if there are posts on screen
    if(req.query.postIDs && req.query.postIDs.length > 0){

        postServices.fetchPostsFromArray(req.query.postIDs, function(postArr){

            // init array for holding perms
            var postPerms = [];

            // check perms for each post
            postArr.forEach(post => {
                
                postServices.canViewPost(req.session.user, post, function(resukt){
                    postPerms.push([post.postID, result]);
                    if(postPerms.length == postArr.length){
                        res.status(200);
                        return res.send(postPerms);
                    }
                });
            });
        });
    }
    else{
        return res.sendStatus(200);
    }
}




module.exports = {

    updateMap,
    updateLocation,
    getUserLocation,
}
