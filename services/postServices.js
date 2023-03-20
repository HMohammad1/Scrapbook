// import user + profile objects
var User = require ('../objects/user.js');
var Profile = require ('../objects/profile.js');
var Post = require('../objects/post.js');
var React = require('../objects/react.js');
var Comment = require('../objects/comment.js');
const session = require("express-session");

const userServices = require('../services/userServices.js');
const app = require('../app.js');

const postDAO = require ('../DAOs/postDAO.js');
const { res } = require('express');

// import upload library
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const { array } = require('yargs');
const { areFriends } = require('../DAOs/userDAO.js');

// moves an image/video into a public folder that corresponds to its postID
function uploadPostMedia(postID, fileData, callback){

    // init array for holding uploaded paths
    links = [];
    // make dir if not exists
    var uploadDir =  path.join(__dirname, `../public/img/p/${postID}`);
    if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, 0744);
    }
    filesToUpload = Object.keys(fileData).length;
    for(const fileKey in fileData){

        const data = fileData[fileKey];

        var rawIMG = fs.readFileSync(data.path);

        var filename = encodeURIComponent(data.name.replace(/\s/g, "-"));
        var newPath = path.join(uploadDir, `/${filename}`);

        fs.writeFile(newPath, rawIMG, function(err){
            if(err){
                // allows to fail gracefully
                console.log(err);
                filesToUpload--;
            }
            else{

                var uploadedPath = `/img/p/${postID}/${data.name}`;
                // insert new image link to link array
                links.push(uploadedPath);
                if(links.length == filesToUpload){
                    return callback(null, links);
                }
            }
        });
    };
}


// create a new post
const createPost = (req, res) => {

    // generate a new postID
    var postID;
    var taken = true;
    do{
        postID = Math.floor(Math.random() * 2147483646);
        postDAO.postIDexists(postID, function(err, result){
            if(err){
                throw err;
            }
            taken = result;
        });
    } while(!taken);

    // get current location of user
    if(req.session.user.userID != 0){
        var user = req.session.user;
        coords = user.coords;
        //coords = user.getCoords();
        userID = user.userID;
    }
    else{
        res.redirect(302, "/login");
    }

    // make directory for new post
    fs.mkdir(path.join(__dirname, `../public/img/${postID}`), function(err){

        if(err){
            throw err;
        }

    });

    // TESTING VARS
    // userID = 2005151994;
    // coords = [55.909095, -3.319584];


    postDAO.insertPost(postID, userID, req.fields.title, req.fields.description, coords[0], coords[1], function(err, result){

        if(err){
            console.log(err);
            return res.sendStatus(500);
        }

        if(req.files){

            uploadPostMedia(postID, req.files, function(err, links){

                if(err){
                    console.log(err);
                    return res.sendStatus(500);
                }

                // if all files uploaded okay then insert links to DB
                postDAO.insertPostMedia(postID, links, function(err, result){

                    if(err){
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    else{

                        // link to new post
                        res.status(200);
                        redir = `/profile/${req.session.user.profile.username}/${postID}`;
                        console.log(redir);
                        return res.send(redir);
                    }

                });
            });
        }else{
            // get request to fetch post
            return res.redirect(302, `/profile/${req.session.user.profile.username}/${postID}`);
        }

    });


}

// returns an array with all of a users posts
const getUserPosts = (req, res) =>{

    // userID from GET request
    var userID = req.params.userID;

    // get profile from ID
    userServices.getProfileByID(userID, function(profile){
        if(!profile){
            res.sendStatus(404);
            return;
        }
        // get all posts
        postDAO.getAllUserPosts(userID, function(err, rows){

            if(!rows){
                res.status(404);
                return;
            }
            else if(err){
                console.log(err);
                res.status(500);
                return;
            }
            else{
                // init array to hold posts
                posts = [];
                // create object for each row with existing profile
                rows.forEach(row => {
                    posts.push(ProfileRowToPost(row, profile));
                });
                res.status(200);
                // generate link for redirect
                return res.render("partials/userPosts", {posts: posts, user: req.session.user});
            }

        });

    });

}

// gets reacts from CSVs of reactions and userIDs
function formatReacts(reactions, userIDs){

    // check for empty set
    if(reactions === null || userIDs === null){
        return null;
    }

    // split strings into arrays
    reactions = reactions.split(',');
    userIDs = userIDs.split(',');

    // something went wrong somewhere
    if(reactions.length != userIDs.length){
        return null;
    }

    // init react objects
    var happy = new React('<i class="bi bi-emoji-smile-fill" id="happy"></i>');
    var laugh = new React('<i class="bi bi-emoji-laughing-fill" id="laugh"></i>');
    var love = new React('<i class="bi bi-emoji-heart-eyes-fill" id="love"></i>');
    var sad = new React('<i class="bi bi-emoji-frown-fill" id="sad"></i>');
    var angry = new React('<i class="bi bi-emoji-angry-fill" id="angry"></i>');

    for(i=0; i<reactions.length; i++){

        switch(reactions[i]){
            case "love":
                love.addUser(userIDs[i]);
                break;
            case "happy":
                happy.addUser(userIDs[i]);
                break;
            case "laugh":
                laugh.addUser(userIDs[i]);
                break;
            case "sad":
                sad.addUser(userIDs[i]);
                break;
            case "angry":
                angry.addUser(userIDs[i]);
                break;
            default:
                // if not recognised do nothing
                break;
        }
    }

    //init array for holding reacts
    var reacts = [happy, laugh, love, sad, angry];

    // sort + filter
    reacts = sortReacts(reacts);

    // return populated object
    return reacts;

}



// takes a row from the a getPost query and converts it to a post object w/ user profile attatched
function rowToPost(postData, callback){

    // assign userID
    var userID = postData.userID;

    // only split set with values in it
    if(postData.media){
        postData.media = postData.media.split(',');
    }


    // get profile
    userServices.getProfileByID(userID, function(profile){

        var post = new Post(
            postData.postID,
            [postData.lat, postData.long],
            postData.media, 
            postData.title, 
            postData.descr, 
            postData.posted, 
            postData.priv, 
            profile, 
            formatReacts(postData.reacts, postData.left_by)
        );
        
        return callback(post);
    });

}

// takes a row from the a getPost query and a profile object then converts it to a post object w/ user profile attatched
function ProfileRowToPost(postData, profile){

    // only split set with values in it
    if(postData.media){
        postData.media = postData.media.split(',');
    }

    post = new Post(
        postData.postID,
        [postData.lat, postData.long],
        postData.media, 
        postData.title, 
        postData.descr, 
        postData.posted, 
        postData.priv, 
        profile, 
        formatReacts(postData.reacts, postData.left_by)
    );

    return post;

}

// returns a post object complete with poster profile
const getPostByID = (req, res) => {

    // postID from the GET request
    postID = req.params.ID;

    try{

        postDAO.getPostByID(postID, function(err, postData){
            // error check
            if(!err){

                // post doesn't exist -- 404
                if(postData === undefined){
                    res.status(404)
                    return res.send();
                }
                rowToPost(postData, function(post){
                    // if public or friends only or own post
                        if(canViewPost(req.session.user, post)){
                            res.status(200);
                            return res.render("partials/overlays/post", {post: post, user:req.session.user});
                        }
                        else{
                            return res.sendStatus(403);
                        }
                });
            }
            else{
                console.log(err);
                return res.sendStatus(500);
            }
        });
    }
    catch(err){
        console.log(err);
        return res.sendStatus(500);
    }

}


// returns post objects
function fetchPostsFromArray(postIDs, callback){

    postDAO.getPostsByID(postIDs, function(err, rows){

        if(err){
            return null;
        }
        else{

            // init array for holding posts
            var postArr = [];

            // add posts to array
            rows.forEach(row =>{

                rowToPost(row, function(post){

                    postArr.push(post);
                    if(postArr.length == rows.length){
                        return callback(postArr);
                    }
                });
            });
        }
    });
}


// returns a post object complete with poster profile
function fetchPostByID(postID, callback){

    try{

        postDAO.getPostByID(postID, function(err, postData){
            // error check
            if(!err){

                // post doesn't exist -- 404
                if(postData === undefined){
                    return res.send("404");
                }

                console.log(postData);

                // assign userID
                userID = postData.userID;

                // get profile
                userServices.getProfileByID(userID, function(profile){

                    // fetch media links
                    getPostMedia(postID, function(links){;

                        // create post w/ profile & media links
                        var post = new Post(postID, [postData.lat, postData.long], links, postData.title, postData.descr, postData.posted, profile);

                        return callback(post);
                    });
                });

            }
            else{
                console.log(err);
                throw err;
            }
        });
    }
    catch(err){
        callback(false);
    }

}


const addComment = (req, res) =>{

    // get vars from POST
    var userID = req.session.user.userID;
    var postID = req.fields.postID;
    var comment = req.fields.comment;

    // check loggedin
    if(userID == 0){
        res.redirect(302, "/login");
    }

    postDAO.addPostComment(postID, userID, comment, function(err, result){

        if(!err){
            res.sendStatus(200);
        }
        else{
            return res.sendStatus(500);
        }
    });

};

// returns an array of 
const getPostComments = (req, res) =>{

    var postID = req.params.postID;

    postDAO.getPostComments(postID, function(err, rows){

        // error check
        if(err){
            res.status(500);
            res.send();
        }
        else{

            // init comment array
            comments = [];

            if(rows.length == 0){
                // post exists but no comments
                res.status(206);
                return res.send();
            }

            rows.forEach(row =>{

                // fetch profile for commenter
                userServices.getProfileByID(row.userID, function(profile){

                    temp = new Comment(row.TEXT, profile);
                    comments.push(temp);
                    if(comments.length == rows.length){
                        // return populated comment array
                        res.status(200)
                        return res.render("partials/post/postComments", {comments: comments, user:req.session.user});
                    }
                });
            });
        }
    });

}

// add a react to a post based upon the GET param in the link
const addPostReact = (req, res) =>{

    var react = req.params.reaction;
    var postID = req.params.postID;
    var userID = req.session.user.userID;

    // check loggedin
    if(userID == 0){
        res.redirect(302, "/login");
    }

    // check post exists
    postDAO.postIDexists(postID, function(err, result){

        // if error send 500
        if(err){
           return res.sendStatus(500);
        }
        // if post doesn't exist send error 
        else if(!result){
            return res.sendStatus(404)
        }
        // no error and post + react are valid -- add / update react
        else{

            // check if user has already reacted to this post
            postDAO.userReactedToPost(userID, postID, function(err, result){
                    
                if(err){
                    return res.sendStatus(500);
                }
                // if user has existing react update it
                else if(result){

                    postDAO.updateReact(postID, userID, react, function(err, result){

                        if(result){
                            // fetch updated reactions
                            getAllPostReacts(postID, function(reacts){
                                if(!reacts){
                                    // if failed 
                                    return res.sendStatus(206);
                                }
                                // OK
                                res.status(200);
                                return res.render('partials/post/reactions', {reacts: reacts, user: req.session.user});
                            });
                        }
                        else{
                            console.log(err);
                            return res.sendStatus(400);
                        }
                    });
                }
                // add new react
                else{
                    postDAO.addReact(postID, userID, react, function(err, result){

                        if(!err){
                            // fetch updated reactions
                            getAllPostReacts(postID, function(reacts){
                                if(!reacts){
                                    // if failed 
                                    return res.sendStatus(206);
                                }
                                // OK
                                res.status(200);
                                return res.render('partials/post/reactions', {reacts: reacts, user: req.session.user});
                            });
                        }
                        else{
                            // server should err if react is invalid
                            console.log(err);
                            return res.sendStatus(400);
                        }
    
                    });
                }
            
            });               
        }
    });
}


// sorts reacts in descending order and removes any empty reacts
function sortReacts(reacts){


    // order reacts in descending order of popularity for this post
    reacts = reacts.sort(function(a,b){
        if(a.left_by.length > b.left_by.length){
            return -1;
        }
        else if(a.left_by.length < b.left_by.length){
            return 1
        }
        else{
            return 0;
        }
    });

    // remove empty reacts
    reacts = reacts.filter(react => react.left_by.length > 0);

    return reacts;
}


// returns an associative array containing each react and who left it
function getAllPostReacts(postID, callback){

    // check post exists
    postDAO.postIDexists(postID, function(err, result){

        // if error callback null
        if(err){
            return callback(null);
        }
        // fetch reacts
        else{
            postDAO.getPostReacts(postID, function(err, rows){

                if(result){

                    // init react objects
                    var happy = new React('<i class="bi bi-emoji-smile-fill" id="happy"></i>');
                    var laugh = new React('<i class="bi bi-emoji-laughing-fill" id="laugh"></i>');
                    var love = new React('<i class="bi bi-emoji-heart-eyes-fill" id="love"></i>');
                    var sad = new React('<i class="bi bi-emoji-frown-fill" id="sad"></i>');
                    var angry = new React('<i class="bi bi-emoji-angry-fill" id="angry"></i>');
                    
                    // sort rows into each category
                    rows.forEach(row =>{

                        switch(row.reaction){
                            case "love":
                                love.addUser(row.react_from);
                                break;
                            case "happy":
                                happy.addUser(row.react_from);
                                break;
                            case "laugh":
                                laugh.addUser(row.react_from);
                                break;
                            case "sad":
                                sad.addUser(row.react_from);
                                break;
                            case "angry":
                                angry.addUser(row.react_from);
                                break;
                            default:
                                // if not recognised do nothing
                                break;
                        }

                    });

                    //init array for holding reacts
                    var reacts = [happy, laugh, love, sad, angry];

                    // sort + filter
                    reacts = sortReacts(reacts);

                    // return populated object
                    return callback(reacts);
                }
                else{
                    console.log(err);
                    return callback(null);
                }

            });
        }
    });
}


// remove the react
const removePostReact = (req, res) =>{

    var postID = req.params.postID;
    var userID = req.session.user.userID;

    // check loggedin
    if(userID = 0){
        res.redirect(302, "/login");
    }

    // check post exists
    postDAO.postIDexists(postID, function(err, result){

        // if error callback null
        if(err){
            res.sendStatus(404);
        }

        postDAO.removeReact(userID, postID, function(err, result){
            if(result){

                // fetch updated reactions
                getAllPostReacts(postID, function(reacts){
                    if(!reacts){
                        // if failed 
                       return res.sendStatus(206);
                    }
                    // OK
                    res.status(200);
                    return res.render('partials/post/reactions', {reacts: reacts, user: req.session.user});
                });
            }
            else{
                console.log(err);
                return res.sendStatus(500);
            }
        });

    });
}

const POST_RANGE = 50;

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

// returns true if can - false if not
function canViewPost(user, post){

    // can always view own posts
    if(user.userID && post.profile && user.userID == post.profile.userID){
        return true;
    }
    // priv is only true for public posts
    else if(!post.priv){

        // check if users are friends
        if(userServices.areFriends(user.userID, post.profile.userID)){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        // check range
        if(withinRange(user.coords, post.coords)){
            return true;
        }
        else{
            return false;
        }

    }
}

/* const getAllPosts = (req, res) => {

    postDAO.getAllPosts(function(err, result) {
        if (result) {
            return result;
        } else {
            console.log(err);

            return null;
        }
    })
} */

module.exports = {

    getPostByID,
    fetchPostsFromArray,
    getUserPosts,
    createPost,
    addComment,
    getPostComments,
    addPostReact,
    removePostReact,
    canViewPost
    //getAllPosts

}