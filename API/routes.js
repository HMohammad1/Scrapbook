console.log("OPENING ROUTER");

//require ('../entities/client.js');
const express = require("express");
const userServices = require("../services/userServices");
const postServices = require("../services/postServices");

//define a router and create routes
const router = express.Router();


//route for signups & login
router.post("/API/signup", userServices.createAccount);
router.post("/API/login", userServices.login);
router.get("/API/logout", userServices.logout);

// route to get & create a post
router.get("/API/post/:ID", postServices.getPostByID);
router.post("/API/upload", postServices.createPost);

// get all posts by a user
router.get("/API/posts/:userID", postServices.getUserPosts);

router.get("/API/sendRequest/:sendTo", userServices.sendFriendRequest);
router.post("/API/updateRequest", userServices.updateFriendRequest);
router.get("/API/getFriends", userServices.getFriendProfiles);


// comment functions
router.post("/API/addComment", postServices.addComment);
router.get("/API/postComments/:postID", postServices.getPostComments);

// react functions
router.get("/API/addReact/:postID/:reaction");
router.get("/API/removeReact/:postID");

// permanent menu item links
router.get("/profile/:username", (req, res) =>{

    if(typeof(req.session.user.profile !== 'undefined') && req.session.user.profile.username == req.params.username){
        res.render("index", {profile: req.session.user.profile, sidebar: "profile", myprofile: true});
    }
    else{
        userServices.getProfileByUsername(req.params.username, function(profile){
            if(!profile){
                res.send(404);
                return;
            }
            res.render("index", {profile: profile, sidebar: "profile", myprofile: false});
        });
    }
});

router.get("/friends", (req, res) =>{

    // check user is logged in
    if(req.session.user === undefined){
        return res.redirect(302, '/');
    }

    userServices.getFriendProfiles(req.session.user.userID, function(friends){

        if(!friends){
            return res.send(500);
        }

        // prompt to add friends if none are in the DB
        if(friends.length == 0){
            empty = true;
        }
        else{
            empty = false;
        }

        return res.render("index", {sidebar: "friends", friends: friends, empty: empty});
    });


});
  
//dynamic menu items
router.get("/API/profile/:username", (req, res) =>{
    if(typeof(req.session.user) !== 'undefined' && req.session.user.profile.username == req.params.username){
        return res.render("partials/profile", {profile: req.session.user.profile, myprofile: true});
    }
    else{
        userServices.getProfileByUsername(req.params.username, function(profile){
            if(!profile){
                res.send(404);
                return;
            }
            else{
                return res.render("partials/profile", {profile: profile, myprofile: false});
            }
        });
    }
});

router.get("/API/friends", (req, res) =>{

    // check user is logged in
    if(req.session.user === undefined){
        return res.status(403);
    }

    userServices.getFriendProfiles(req.session.user.userID, function(friends){

        if(!friends){
            return res.send(500);
        }

        // prompt to add friends if none are in the DB
        if(friends.length == 0){
            empty = true;
        }
        else{
            empty = false;
        }

        return res.render("partials/sidebar/friends", {friends: friends, empty: empty});
    });


});

console.log("EXPORTING ROUTER");
//export router
module.exports = router;