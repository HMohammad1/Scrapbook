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
function uploadMedia(postID, data, callback){

    // init array for holding uploaded paths
    links = [];

    var rawIMG = fs.readFileSync(data.path);
    var filename = encodeURIComponent(data.name.replace(/\s/g, "-"));
    var newPath = path.join(__dirname, `/img/${postID}/${filename}`);

    fs.writeFile(newPath, rawIMG, function(err){
        if(err){
            return callback(err, null);
        }
        else{
            // insert new image link to link array
            links.push(`/img/${postID}/${filename}`);
            return callback(null, links);
        }

    });
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
    if(req.session != null && req.session.user){
        var user = req.session.user;
        coords = [55.909095, -3.319584];
        //coords = user.getCoords();
        userID = user.userID;
    }
    else{
        res.send("You must be logged in to create a post");
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
            throw err;
        }

        if(!req.files.myfile.length){

            uploadMedia(postID, req.files.myfile, function(err, links){

                if(err){
                    throw err;
                }

                // if all files uploaded okay then insert links to DB
                postDAO.insertPostMedia(postID, links, function(err, result){

                    if(err){
                        throw err;
                    }
                    else{

                        // get request to fetch post
                        res.redirect(`/API/post/${postID}`);
                    }

                });
            });
        }
        else{
            res.send("Multiple file uploads are not currently supported");
        }

    });


}


// fetch all media associated with a post and return them as a link of arrays
function getPostMedia(postID, callback){

    // init array
    var links = [];

    postDAO.getPostMediaByID(postID, function(err, rows){

        if(!err){

            rows.forEach(row => {
            
                links.push(row.link);

            });

            // return populated array
            return callback(links);

        }
        else{
            throw err;
        }
        
    });


}


// returns an array with all of a users posts
const getUserPosts = (req, res) =>{

    // userID from GET request
    var userID = req.params.userID;

    postDAO.getAllUserPostIDs(userID, function(err, rows){

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

            // init post array
            posts = [];

            // counter for posts to fetch
            var postsToFetch = rows.length;

            rows.forEach(row =>{

                // get post object and add to array
                fetchPostByID(row.postID, function(post){

                    // error check
                    if(post){

                        posts.push(post);
                        if(posts.length === postsToFetch){
                            // once all IDs processed return the array
                            console.log(posts);
                            res.status(200);
                            return res.render("partials/userPosts", {posts: posts, user: req.session.user});
                        }

                    }
                    else{
                        // allows to fail gracefully if a post cannot be retrieved for some reason
                        postsToFetch--;
                    }

                });
            });


        }

    });

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

                console.log(postData);

                // assign userID
                userID = postData.userID;

                // get profile
                userServices.getProfileByID(userID, function(profile){

                    // fetch media links
                    getPostMedia(postID, function(links){

                        getAllPostReacts(postID, function(reacts){

                            console.log(reacts);
                            // create post w/ profile & media links
                            var post = new Post(postID, [postData.lat, postData.long], links, postData.title, postData.descr, postData.posted, postData.priv, profile, reacts);
                            
                            // if public or friends only or own post
                            if(postData.priv == 1 || userServices.areFriends(req.session.user.userID, postData.profile.userID) || req.session.user.userID == postData.profile.userID){
                                return res.render("partials/overlays/post", {post: post, user:req.session.user});
                            }
                            else{
                                return res.sendStatus(403);
                            }
                        });
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
        return res.send(err);
    }

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

    // not a valid react -- respond with error
    // if(typeof(react) != String){
    //    return res.sendStatus(400);
    // }

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

module.exports = {

    getPostByID,
    getUserPosts,
    createPost,
    addComment,
    getPostComments,
    addPostReact,
    removePostReact

}