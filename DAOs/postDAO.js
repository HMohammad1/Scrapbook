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

    let query = "INSERT INTO post_media (postID, link, pos) VALUES ";
    var params = [];

    // build the query
    links.forEach((link, index) => {

        // append new vaulue set to query
        query += "(?,?,?),";

        // add to params array
        params.push(postID, link, index+1);

    });

    // trim trailing comma
    query = query.replace(new RegExp(',$'), ";");

    DB.executeQuery(query, params, function(err, rows){
        if(err){
            // if error return here
            return callback(err, false)
        }
        else{
            return callback(null, true);
        }
    });
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

    let query = "SELECT GROUP_CONCAT(link) AS LINKS FROM post_media WHERE postID = ? ORDER BY pos ASC";
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
        SELECT  p.postID AS postID,
                p.posted_by as userID,
                p.title as title,
                p.descr as descr,
                p.posted as posted,
                p.latitude as 'lat',
                p.longitude as 'long',
                p.public as 'priv',
                GROUP_CONCAT(m.link) AS 'media',
                GROUP_CONCAT(r.reaction) AS 'reacts',
                GROUP_CONCAT(r.react_from) AS 'left_by'
        FROM posts AS p
        LEFT JOIN post_media AS m
        ON p.postID = m.postID
        LEFT JOIN post_reactions AS r
        ON p.postID = r.postID
        WHERE p.postID = ?;`;

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


function getPostsByID(postIDs, callback){
    let query = `
    SELECT  p.postID AS postID,
            p.posted_by as userID,
            p.title as title,
            p.descr as descr,
            p.posted as posted,
            p.latitude as 'lat',
            p.longitude as 'long',
            p.public as 'priv',
            GROUP_CONCAT(m.link) AS 'media',
            GROUP_CONCAT(r.reaction) AS 'reacts',
            GROUP_CONCAT(r.react_from) AS 'left_by'
    FROM posts AS p
    LEFT JOIN post_media AS m
    ON p.postID = m.postID
    LEFT JOIN post_reactions AS r
    ON p.postID = r.postID
    WHERE p.postID IN (`;

    let params = [];

    // add each ID to params and query
    postIDs.forEach(postID => {

        query += "?,";
        params.push(postID);
    });

    // remove trailing comma and close bracket
    query = query.replace(new RegExp(',$'), ") GROUP BY p.postID;");

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

    let query = `SELECT text AS TEXT, comment_from as userID FROM post_comments WHERE postID = ? ORDER BY commentID DESC`
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

// gets all posts
/* function getAllPosts(callback) {
    let query = `
    SELECT  p.postID AS postID,
            p.posted_by as userID,
            p.title as title,
            p.descr as descr,
            p.posted as posted,
            p.latitude as 'lat',
            p.longitude as 'long',
            p.public as 'priv',
            GROUP_CONCAT(m.link) AS 'media',,
    FROM posts AS p
    LEFT JOIN post_media AS m
    ON p.postID = m.postID`;

    let params = [];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            return callback(null, rows);
        }
        else{
            console.log(err);
            return callback(err, null);
        }

    });
} */

// gets all posts a user has made
function getAllUserPosts(userID, callback){
    
    let query = `
        SELECT  p.postID AS postID,
            p.posted_by as userID,
            p.title as title,
            p.descr as descr,
            p.posted as posted,
            p.latitude as 'lat',
            p.longitude as 'long',
            p.public as 'priv',
            GROUP_CONCAT(m.link) AS 'media',
            GROUP_CONCAT(r.reaction) AS 'reacts',
            GROUP_CONCAT(r.react_from) AS 'left_by'
        FROM posts AS p
        LEFT JOIN post_media AS m
        ON p.postID = m.postID
        LEFT JOIN post_reactions AS r
        ON p.postID = r.postID
        WHERE p.posted_by = ?
        GROUP BY p.postID
        ORDER BY p.posted DESC;`
    
    let params=[userID];

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
    let params = [postID, userID];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            if(rows[0].reacted > 0){
                console.log(`User #${userID} has reacted to post #${postID}`);
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

    let query =  "DELETE FROM post_reactions WHERE react_from = ? AND postID = ?";
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
    getPostsByID,
    getAllUserPosts,
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
    //getAllPosts

}