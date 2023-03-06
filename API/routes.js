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

// permanent profile link
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
  
//menu items
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

console.log("EXPORTING ROUTER");
//export router
module.exports = router;