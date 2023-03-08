const { query } = require("express");
const { use } = require("../API/routes");
const DB = require("./queryHandler");

// inserts a post with the given postID
function insertPost(postID, userID, title, desc, lat, long, callback){

    let query = "INSERT INTO posts (postID, posted_by, title, descr, latitude, longitude) VALUES (?,?,?,?,?,?)";
    let params = [postID, userID, title, desc, lat, long];
    DB.executeQuery(query, params, function(err, rows){
        if(err){
            return callback(err, false);
        }
        else{
            return callback(null, true);
        }
    });
}


// add media to an existing post -- media is an array containing links to the media that has been uploaded to the server
function insertPostMedia(postID, links, callback){

    let query = "INSERT INTO post_media (postID, link, pos) VALUES (?,?,?)";

    // init counter
    var pos = 1;
    links.forEach(link => {
        
        // populate params array with new variables
        params = [postID, link, pos];
        // exectute query
        DB.executeQuery(query, params, function(err, rows){
            if(err){
                // if error return here
                return callback(err, false)
            }
            else{
                // if not move to next item in array
                pos++;
            }
        });
    });

    // if all media inserted then return true
    return callback(null, true);

}

function postIDexists(postID, callback){

    let query = "SELECT count(postID) AS count FROM posts WHERE postID = ?";
    let params = [postID];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            if(rows[0].count == 0){
                return callback(null, false);
            }
            else{
                return callback(null, true);
            }
        }
        else{
            return callback(err, null);
        }
    });


}


function getPostMediaByID(postID, callback){

    let query = "SELECT link FROM post_media WHERE postID = ? ORDER BY pos ASC";
    let params = [postID];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            return callback(null, rows);
        }
        else{
            return callback(err, false);
        }

    });

}


function getPostByID(postID, callback){

    let query = `
        SELECT  postID AS postID,
                posted_by as userID,
                title as title,
                descr as descr,
                posted as posted,
                latitude as 'lat',
                longitude as 'long'
        FROM posts
        WHERE postID = ?`

    let params = [postID];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            console.log(rows);
            return callback(false, rows[0]);
        }
        else{
            console.log(err);
            return callback(err, false);
        }

    });

}

function addPostComment(postID, userID, comment, callback){

    let query = `INSERT INTO post_comments (postID, comment_from, text) VALUES (?,?,?)`;
    let params = [postID, userID, comment];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            console.log(rows);
            return callback(null, true);
        }
        else{
            console.log(err);
            return callback(err, false);
        }

    });


}

// get all comments and their associated userIDs
function getPostComments(postID, callback){

    let query = `SELECT text AS TEXT, comment_from as userID FROM post_comments WHERE postID = ?`
    let params = [postID];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            return callback(null, rows);
        }
        else{
            console.log(err);
            return callback(err, null);
        }

    });

}


// gets all posts a user has made
function getAllUserPostIDs(userID, callback){

    let query = "SELECT postID FROM posts WHERE posted_by = ? ORDER BY posted DESC";
    let params = [userID];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            return callback(null, rows);
        }
        else{
            console.log(err);
            return callback(err, null);
        }

    });


}

// adds a reaction to a post
function addReact(postID, userID, reactID, callback){

    let query =  "INSERT INTO post_reactions (postID, react_from, reaction) VALUES(?,?,?)";
    let params = [postID, userID, reactID];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            return callback(null, true);
        }
        else{
            return callback(err, false);
        }

    });
}

// updates an existing user/post react pair with a new reaction
function updateReact(userID, postID, react, callback){
    let query = "UPDATE post_reactions SET reaction = ? WHERE react_from = ? AND postID = ?";
    let params = [react, userID, postID];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            return callback(null, true);
        }
        else{
            return callback(err, false);
        }

    });
}

function userReactedToPost(userID, postID, callback){

    let query = "SELECT count(reaction) AS reacted FROM post_reactions WHERE react_from = ? AND postID = ?";
    let params = [userID, postID];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            if(reacted > 0){
                return callback(null, true);
            }
            else{
                return callback(null, false);
            }
        }
        else{
            return callback(err, null);
        }

    });

}


function removeReact(userID, postID, callback){

    let query =  "DELETE FROM post_reactions WHERE reaction_from = ? AND postID = ?";
    let params = [userID, postID];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            return callback(null, true);
        }
        else{
            return callback(err, false);
        }

    });
}


function getPostReacts(postID, callback){

    // orders in oldest to newest as results will be popped into react obj
    let query = "SELECT reaction, react_from FROM post_reactions WHERE postID = ? ORDER BY posted ASC";
    let params = [postID];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            return callback(null, rows);
        }
        else{
            return callback(err, null);
        }

    });

}

//function removeReact(postID, )



module.exports = {

    postIDexists,
    getPostByID,
    getAllUserPostIDs,
    insertPost,
    insertPostMedia,
    getPostMediaByID,
    addPostComment,
    getPostComments,
    addReact,
    updateReact,
    removeReact,
    userReactedToPost,
    getPostReacts

}