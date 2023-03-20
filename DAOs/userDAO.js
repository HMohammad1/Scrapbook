const { query } = require("express");
const DB = require("./queryHandler");

// creates a profile for the given userID
function insertProfile(userID, d_n, fname, lname, callback){

    let query = "INSERT INTO user_profiles (userID, display_name, fname, lname) VALUES (?,?,?,?)";
    let params = [userID, d_n, fname, lname];

    DB.executeQuery(query, params, function(err, rows){
        if(err){
            return callback(err, false);
        }
        else{
            return callback(null, true);
        }
    });

}

// insert login details -- returns true on success
function insertLogin(userID, username, email, hash, callback){

    let query = "INSERT INTO user_logins (userID, username, email, hash) VALUES (?,?,?,?)";
    let params = [userID, username, email, hash];

    DB.executeQuery(query, params, function(err, rows){
        if(err){
            return callback(err, null)
        }
        else{
            return callback(null, true);
        }
    });

}

function insertSettings(userID, callback){

    let query = "INSERT INTO user_settings (userID) VALUES (?)";
    let params = [userID];

    DB.executeQuery(query, params, function(err, rows){
        if(err){
            return callback(err, null)
        }
        else{
            return callback(null, true);
        }   
    });

}

// assign default pfp
function insertPFP(userID, callback){

    let query = "INSERT INTO user_pfp (userID) VALUES (?)";
    let params = [userID];

    DB.executeQuery(query, params, function(err, rows){
        if(err){
            return callback(err, false);
        }
        else{
           return callback(null, true);
        }
    });

}


function updateProfile(userID, bio, disp, colour, link, callback){

    let query = "UPDATE user_profiles AS u, user_pfp AS p SET u.bio=?, u.display_name=?, u.colour=?, p.link=? WHERE p.userID = ? AND u.userID = p.userID";
    let params = [bio, disp, colour, link, userID];

    DB.executeQuery(query, params, function(err, rows){
        if(err){
            return callback(err, null);
        }
        else{
            return callback(null, true);
        }
    });
}


function friendCount(userID, callback){

    let query = "SELECT count(requestID) as friendCount FROM friend_requests WHERE (req_to=? OR req_from=?) AND accepted=1";
    let params=[userID, userID];

    DB.executeQuery(query, params, function(err, rows){
        if(err){
            return callback(err, null);
        }
        else{
            return callback(null, rows[0].friendCount);
        }
    });

}

function postCount(userID, callback){
    let query = "SELECT count(postID) as postCount FROM posts WHERE posted_by =?";
    let params = [userID];

    DB.executeQuery(query, params, function(err, rows){
        if(err){
            return callback(err, null);
        }
        else{
            return callback(null, rows[0].postCount);
        }
    });
}

// links the current IP of a user to their account
function logIP(userID){



}


// return true if email exists
function emailExists(email, callback){

    let query = "SELECT count(userID) AS count FROM user_logins WHERE email = ?";
    let params = [email];

    DB.executeQuery(query, params, function(err, rows, fields){
        if(!err){
            if(rows[0].count == 0){
                return callback(null, false)
            }
            else{
                return callback(null, true);
            }
        }
        // connection / query failed -- throw error
        else{
            return callback(err, null);
        }

    });
}

function usernameExists(username, callback){

    let query = "SELECT count(userID) AS count FROM user_logins WHERE username = ?";
    let params = [username];

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

function userIDexists(userID, callback){

    let query = "SELECT count(userID) AS count FROM user_logins WHERE userID = ?";
    let params = [userID];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            return callback(null, rows[0]);
        }
        else{
            return callback(err, null);
        }
    });


}


function fetchPaswordByEmail(email, callback){

    let query = `SELECT userID, hash FROM user_logins WHERE email = ?`;
    let params = [email];

    DB.executeQuery(query, params, function(err, rows, fields){
        if(!err){
            // if empty set returned email doesn't exist
            if(rows.length == 0){
                return callback(null, false)
            }
            else{
                return callback(null, rows[0]);
            }
        }
        else{
            return callback(err, null);
        }
    });

}

function fetchPaswordByUsername(username, callback){

    let query = `SELECT userID, hash FROM user_logins WHERE username = ?`;
    let params = [username];

    DB.executeQuery(query, params, function(err, rows, fields){
        if(!err){
            // if empty set returned username doesn't exist
            if(rows.length == 0){
                return callback(null, false);
            }
            else{
                return callback(null, rows[0]);
            }
        }
        else{
            return callback(err, null);
        }
    });

}

// returns all data for a user -- use getProfileByID to fetch user side details
function getUserByID(userID, callback){

    let query = `
        SELECT  user_logins.username AS username,
                user_logins.email AS email,
                user_profiles.display_name AS display,
                user_profiles.fname AS fname,
                user_profiles.lname AS lname,
                user_profiles.colour AS colour,
                user_profiles.bio AS bio,
                user_pfp.link AS pfp
        FROM user_logins
        INNER JOIN user_profiles ON user_logins.userID = user_profiles.userID
        INNER JOIN user_pfp ON user_logins.userID = user_pfp.userID
        WHERE user_logins.userID = ?    
        `;
    let params = [userID];

    DB.executeQuery(query, params, function(err, rows, fields){

        if(!err){
            if(rows.length == 0){
                return callback(null, false);
            }
            else{
                return callback(null, rows[0]);
            }
        }
        else{
            return callback(err, null);
        }
    });
}

// returns all data for a profile
function getProfileByID(userID, callback){

    let query = `
        SELECT  user_logins.username AS username,
                user_profiles.display_name AS display,
                user_profiles.fname AS fname,
                user_profiles.lname AS lname,
                user_profiles.colour AS colour,
                user_profiles.bio AS bio,
                user_pfp.link AS pfp
        FROM user_logins
        INNER JOIN user_profiles ON user_logins.userID = user_profiles.userID
        INNER JOIN user_pfp ON user_logins.userID = user_pfp.userID
        WHERE user_logins.userID = ?    
        `;
    let params = [userID];

    DB.executeQuery(query, params, function(err, rows, fields){
        
        if(!err){
            if(rows.length == 0){
                return callback(null, false);
            }
            else{
                return callback(null, rows[0]);
            }
        }
        else{

            return callback(err, null);
        }
    });
}

// returns all data for a profile
function getProfileByUsername(username, callback){

    let query = `
        SELECT  user_logins.username AS username,
                user_logins.userID AS userID,
                user_profiles.display_name AS display,
                user_profiles.fname AS fname,
                user_profiles.lname AS lname,
                user_profiles.colour AS colour,
                user_profiles.bio AS bio,
                user_pfp.link AS pfp
        FROM user_logins
        INNER JOIN user_profiles ON user_logins.userID = user_profiles.userID
        INNER JOIN user_pfp ON user_logins.userID = user_pfp.userID
        WHERE user_logins.username = ?    
        `;
    let params = [username];

    DB.executeQuery(query, params, function(err, rows, fields){
        
        if(!err){
            if(rows.length == 0){
                return callback(null, false);
            }
            else{
                return callback(null, rows[0]);
            }
        }
        else{

            return callback(err, null);
        }
    });
}


function insertFriendRequest(sentBy, sentTo, callback){

    let query = `INSERT INTO friend_requests (req_from, req_to) VALUES (?,?)`;
    let params = [sentBy, sentTo];

    DB.executeQuery(query, params, function(err, rows, fields){
        
        if(!err){
            return callback(true);
        }
        else{
            return callback(false);
        }
    });


}


function updateFriendRequest(reqID, status, callback){

    let query = `UPDATE friend_requests SET accepted = ? WHERE requestID=?`;
    let params = [status, reqID];

    DB.executeQuery(query, params, function(err, rows, fields){
        
        if(!err){
            return callback(true);
        }
        else{

            throw err;
        }
    });


}


function deleteFriendRequest(user1, user2, callback){

    let query = `DELETE * FROM friend_requests WHERE (req_from = ? AND req_to = ?) OR (req_from = ? AND req_to = ?)`;
    // swap param order for each or 
    let params = [user1, user2, user2, user1];

    DB.executeQuery(query, params, function(err, rows, fields){
        
        if(!err){
            return callback(true);
        }
        else{

            throw err;
        }
    });


}

function areFriends(user1, user2, callback){

    let query = "SELECT accepted FROM friend_requests WHERE req_from = (? OR ?) AND req_to = (? OR ?)";
    let params = [user1, user2, user1, user2];

    DB.executeQuery(query, params, function(err, rows, fields){
        
        if(!err){
            if(rows[0] && rows[0].accepted){
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


// returns userIDs for a users friends list 
function fetchPending(userID, callback){

    let query = `SELECT req_from AS userID, sent, requestID as reqID
                 FROM friend_requests
                 WHERE req_to = ? AND accepted IS NULL`;

    let params = [userID];

    DB.executeQuery(query, params, function(err, rows, fields){
        
        if(!err){
            return callback(null, rows);
        }
        else{

            return callback(err, null);
        }
    });

}

// returns userIDs for a users friends list 
function fetchAllFriendIDs(userID, callback){

    let query = `SELECT req_from AS userID 
                 FROM friend_requests
                 WHERE req_to = ? AND accepted = 1
                 
                 UNION ALL
                 
                 SELECT req_to AS userID
                 FROM friend_requests
                 WHERE req_from = ? AND accepted = 1
                 `;

    let params = [userID, userID];

    DB.executeQuery(query, params, function(err, rows, fields){
        
        if(!err){
            return callback(null, rows);
        }
        else{

            return callback(err, null);
        }
    });

}


function searchUsername(string, userID, callback){

    let query = "SELECT userID FROM user_logins WHERE username LIKE ? AND NOT userID = ? ORDER BY username ASC";
    let params = [string+'%', userID];

    DB.executeQuery(query, params, function(err, rows, fields){
        
        if(!err){
            return callback(null, rows);
        }
        else{

            return callback(err, null);
        }
    });

}



module.exports = {

    getUserByID,
    getProfileByID,
    getProfileByUsername,
    fetchPaswordByEmail,
    fetchPaswordByUsername,
    updateProfile,
    emailExists,
    usernameExists,
    friendCount,
    postCount,
    userIDexists,
    insertLogin,
    insertProfile,
    insertPFP,
    insertSettings,
    insertFriendRequest,
    updateFriendRequest,
    fetchPending,
    deleteFriendRequest,
    areFriends,
    fetchAllFriendIDs,
    searchUsername
}