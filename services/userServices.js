// -- TODO --
//  1. create account function
//  2. login function
//  3. logout function
//  4. update pfp function
//  5. update bio function
//  6. update display name function
//  6. update settings functions



// import user + profile objects
var User = require ('../objects/user.js');
var Profile = require ('../objects/profile.js');
var Request = require("../objects/request.js");

const fs = require('fs');
const path = require('path');


const userDAO = require ('../DAOs/userDAO.js');
const { res } = require('express');
const session = require("express-session");

// hashing library and function
const bcrypt = require("bcryptjs");
function hashPassword(password, callback) {
    //set the complexity of the salt generation
    const saltRounds = 10;
    //generate random salt (to be added to the password to generate random hash)
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) {
            throw err;
        } else {
            //hash the password using the generated salt
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    throw err;
                } else {
                    //return the computed hash
                    callback(err, hash);
                }
            });
        }
    });
}

const createAccount = (req, res) => {

    // check passwords match
    if (req.fields.pw1 !== req.fields.pw2){
        console.log(`Password mismatch`);
        res.render("Index", {passwordError: true, message: "Passwords do not match"});
    }

    try{
        // check if email already exists in DB
        userDAO.emailExists(req.fields.email, function(err, result){
            if(result){
                console.log(`Email: ${req.fields.email} is already in use`);
                return res.render("Index", {emailError: true, message: "This email is already linked to a Scrapmap account. <a href='/login'> Log-in here! </a>"});
            }
            else if(err){
                throw err;
            }
            else{
                // check if username is already taken
                userDAO.usernameExists(req.fields.username, function(err, result){
                    if(result){
                        console.log(`Username: ${req.fields.username} is already in use`);
                        return res.render("Index", {usernameError: true, message: "This username is already taken."});
                    }
                    else if(err){
                        throw err;
                    }
                    else{

                        // hash password -- callback prevents async errors
                        hashPassword(req.fields.pw1, function(err, hash){

                            if(!err){
                                // generate a random userID
                                var userID;
                                var count = 1;
                                do{
                                    userID = Math.floor(Math.random() * 2147483646);
                                    userDAO.userIDexists(userID, function(err, rows){
                                        if(err){
                                            throw err;
                                        }
                                        count = rows.count;
                                    })
                
                                } while(count != 1);
                                
                                // inputs validated so start inserts
                                userDAO.insertLogin(userID, req.fields.username, req.fields.email, hash, function(err, result){
                                    if(!result){
                                        throw err;
                                    }
                                    else{
                                        userDAO.insertProfile(userID, req.fields.disp_name, req.fields.fname, req.fields.lname, function(err, result){
                                            if(!result){
                                                throw err;
                                            }
                                            else{
                                                userDAO.insertPFP(userID, function(err, result){
                                                    if(!result){
                                                        throw err;
                                                    }
                                                    else{
                                                        // add default settings
                                                        userDAO.insertSettings(userID, function(err, result){
                                                            if(err){
                                                                res.sendStatus(500);
                                                            }
                                                            else{
                                                                // retrive full user data from server
                                                                getUserByID(userID, function(user){
                                                                    // bind user to session
                                                                    req.session.user = user;
                                                                    req.session.loggedIn = true;
                                                                    req.session.save();

                                                                    // returns output as string
                                                                    //res.send(JSON.stringify(user));
                                                                    res.redirect("/", 302);
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            };
                                        });
                                    };
                                });
                            };
                        });
                    }
                });
            }
        });
    }
    catch(err){ 
        console.log(err);
        return res.render("application", {serverError: true, message: "Oops something went wrong. Please try again later."});
    }
}

// moves an image/video into a public folder for that users PFP
function uploadPFP(userID, data, callback){

    var rawIMG = fs.readFileSync(data.path);
    var filename = encodeURIComponent(data.name.replace(/\s/g, "-"));

    // make dir if not exists
    var uploadDir =  path.join(__dirname, `../public/img/u/${userID}`);
    if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, 0744);
    }
    var newPath = path.join(uploadDir, `/${filename}`);
    fs.writeFile(newPath, rawIMG, function(err){
        if(err){
            console.log(err);
            return callback(err, null);
        }
        else{
            // return new filepath of uploaded img
            return callback(null, `/img/u/${userID}/${filename}`);
        }

    });
}


const updateProfile = (req, res) =>{

    // get values from form
    userID = req.session.user.userID;
    newBio = req.fields.newBio;
    newDisp = req.fields.newDisp;
    newColour = req.fields.newColour;
    newPFP = req.files.newPFP;

    console.log(JSON.stringify(req.files));

    // check if any have changed
    if(newBio == "" || !newBio){
        newBio = req.session.user.profile.bio;
    }
    if(newDisp == "" || !newDisp){
        newDisp = req.session.user.profile.display;
    }
    if(newColour == "" || !newColour || newColour === undefined){
        newColour = req.session.user.profile.colour;
    }
    if(!newPFP){
        newPFP = req.session.user.profile.pfp;
    }
    else{
        // upload the new IMG
        uploadPFP(userID, newPFP, function(err, result){
            if(err){
                return res.sendStatus(500);
            }
            else{
                newPFP = result;
                userDAO.updateProfile(userID, newBio, newDisp, newColour, newPFP, function(err, result){
                    if(err){
                        return res.sendStatus(500);
                    }
                    else{
                        req.session.user.profile.bio = newBio;
                        req.session.user.profile.disp_name = newDisp;
                        req.session.user.profile.pfp = newPFP;
                        req.session.user.profile.colour = newColour;
                        req.session.save();
                        res.status(200);
                        return res.send(JSON.stringify([newBio, newDisp, newPFP, newColour]));
                    }
                });
            }
        })
    }
}


// returns a populated user object complete with profile -- if just a profile is needed user getProfile functions
function getUserByID(userID, callback){


    try{
        // fetch row from DB
        userDAO.getUserByID(userID, function(err, data){
            if(err){
                throw err;
            }

            // create profile
            var profile = new Profile(userID, data.username, data.display, data.fname, data.lname, data.pfp, data.bio, data.colour);
            // create user object
            var user = new User(userID, data.email, profile);
            return callback(user);
        });
    }
    catch{
        return callback(false);
    }



}

// return a user profile from their ID
function getProfileByID(userID, callback){

    try{
        // fetch row from DB
        userDAO.getProfileByID(userID, function(err, data){
            if(err){
                return callback(null);
            }
            else if(data === undefined){
                return callback(null);
            }
            // create profile
            var profile = new Profile(userID, data.username, data.display, data.fname, data.lname, data.pfp, data.bio, data.colour);
            console.log(`returning ${JSON.stringify(profile)} FROM getProfile`);
            return callback(profile);
        });
    }
    catch{
        return callback(false);
    }


}

// return a user profile from their username
function getProfileByUsername(username, callback){

    try{
        // fetch row from DB
        userDAO.getProfileByUsername(username, function(err, data){
            // create profile
            var profile = new Profile(data.userID, data.username, data.display, data.fname, data.lname, data.pfp, data.bio, data.colour);
            return callback(profile);
        });
    }
    catch{
        return callback(false);
    }


}


const fetchHash = (res, ID, callback) => {
    if(ID.includes("@")){
        userDAO.fetchPaswordByEmail(ID, function(err, result){
            if(!result){
                console.log("email doesn't exist");
                return res.render("index", {IDerror: true, message: "There is no Scrapmap account linked to this email."})
            }
            else{
                return callback(result);
            }
        });
    }
    else{
        userDAO.fetchPaswordByUsername(ID, function(err, result){
            if(!result){
                console.log("UN doesn't exist");
                return res.render("index", {IDerror: true, message: "There is no Scrapmap account with this username."})
            }
            else{
                return callback(result);
            }
        });
    }

}

// login using an identifier and a password
const login = (req, res) => {

    // check if identifier is a username or an email
    ID = req.fields.ID;
    fetchHash(res, ID, function(result){

        // hash entered pw and compare to the one from the DB
        bcrypt.compare(req.fields.pw, result.hash, function(err, match){
            if(err){
                return res.render("index", {serverError: true, message: "Oops something went wrong. Please try again later..."});
            }
            // if passwords don't match
            else if(!match){
                return res.render("index", {pwError: true, message: "Incorrect password."});
            }
            // passwords match
            else if(match){
                // get user object from the DB
                getUserByID(result.userID, function(user){
                    console.log("Login success");
                    // bind user to current session
                    req.session.user = user;
                    req.session.loggedIn = true;
                    req.session.save();
                    //res.send(JSON.stringify(user));
                    res.redirect("/", 302);

                });
            }

        });
    });

}

// destroy the current session and return to index
const logout = (req, res) =>{

    req.session.destroy();
    // send back to index
    return res.redirect("/", 302);

}


// sends a friend request from the current session user using userIDs
const sendFriendRequest = (req, res) => {

    // check loggedin
    if(userID == 0){
        res.redirect(302, "/login");
    }
    var userID = req.session.user.userID;
    var sendTo = req.params.sendTo;
    
    userDAO.insertFriendRequest(userID, sendTo, function(result){

        console.log(result);

        if(result){
            res.status(200);
            return res.send();
        }
        else{
            res.status(500);
            return res.send();
        }

    });

    


}

// accepts / declines an existing friend request
const updateFriendRequest = (req, res) =>{

        // check user is logged in
        // check loggedin
        if(userID == 0){
            res.redirect(302, "/login");
        }
    
        var reqID = req.fields.reqID;
        var status = req.fields.status;
        
        userDAO.updateFriendRequest(reqID, status, function(result){
    
            if(result){
                res.status(200);
                return res.send();
            }
            else{
                res.status(500);
                return res.send();
            }
    
        });

}



function fetchAllPendingRequests(userID, callback){

        // check loggedin
        if(userID == 0){
            res.sendStatus(403);
        }

    userDAO.fetchPending(userID, function(err, rows){

        if(err){
            return callback(false);
        }

        // init array
        var requests = [];

        // if empty return with empty profile set
        if(rows.length == 0){
            return callback(requests);
        }

        // for each returned ID fetch the corresponding profile
        profilesToFetch = rows.length;
        rows.forEach(row => {
            
            // get the profile
            getProfileByID(row.userID, function(profile){
                // only push successfully retrieved profiles
                if(profile){
                    
                    var req = new Request(row.reqID, 'Pending', row.sent, profile)

                    requests.push(req);
                    if(requests.length === profilesToFetch){
                        return callback(requests);
                    }

                }
                else{
                    profilesToFetch--;
                }
            });

        });
    });

}

// removes another user from the current session users friends list
const removeFriend = (req, res) =>{
        // check user is logged in
        // check loggedin
        if(userID == 0){
            res.redirect(302, "/login");
        }
    
        var userID = req.session.user.userID;
        var toRemove = req.params.remove;
        
        userDAO.updateFriendRequest(userID, toRemove, function(result){
    
            if(result){
                res.send(`User #${toRemove} removed from your friends list`);
            }
            else{
                throw err;
            }
    
        });
}


// returns an array of profiles that correspond to all the current user's friends
function getFriendProfiles(userID, callback){

    // check loggedin
    if(userID == 0){
        res.redirect(302, "/login");
    }
    
    userDAO.fetchAllFriendIDs(userID, function(err, rows){

        if(!err){

            // init array
            var friendProfiles = [];

            // for each returned ID fetch the corresponding profile
            profilesToFetch = rows.length;
            rows.forEach(row => {
                
                // get the profile
                getProfileByID(row.userID, function(profile){
                    // only push successfully retrieved profiles
                    if(profile){
                       
                        friendProfiles.push(profile);
                        if(friendProfiles.length === profilesToFetch){
                            return callback(friendProfiles);
                        }

                    }
                    else{
                        profilesToFetch--;
                    }
                });

            });
        }
        else{
            return callback(false);
        }

    });
}

// check if two users are friends
function areFriends(user1, user2){

    userDAO.areFriends(user1, user2, function(err, result){

        if(err){
            return null;
        }
        else{
            return result;
        }

    });
}

// returns an array of profiles that correspond to the provided array of userIDs
function getProfiles(userIDs, callback){
    
    // for each returned ID fetch the corresponding profile
    profilesToFetch = userIDs.length;

    // init array
    userProfiles = [];

    userIDs.forEach(userID => {
        
        // get the profile
        getProfileByID(userID, function(profile){
            // only push successfully retrieved profiles
            if(profile){
                
                userProfiles.push(profile);
                if(userProfiles.length === profilesToFetch){
                    return callback(friendProfiles);
                }

            }
            else{
                profilesToFetch--;
            }
        });

    });

}


// takes a partial username and returns potential matches
const searchUsername = (req, res) =>{

    string = req.params.string;
    if(string == ''){
        return res.status(200);
    }

    userDAO.searchUsername(string, function(err, rows){

        if(!err){

            // init array
            var friendProfiles = [];

            // for each returned ID fetch the corresponding profile
            profilesToFetch = rows.length;
            rows.forEach(row => {
                
                // get the profile
                getProfileByID(row.userID, function(profile){
                    // only push successfully retrieved profiles
                    if(profile){
                       
                        friendProfiles.push(profile);
                        if(friendProfiles.length === profilesToFetch){
                            res.status(200);
                            return res.send(JSON.stringify(friendProfiles));
                        }

                    }
                    else{
                        profilesToFetch--;
                    }
                });

            });
        }
        else{
            return res.status(500);
        }

    });




}

// get friend / post counts for profile page
const getProfileCounts = (req,res) =>{

    let userID = req.params.userID;
    count = [];

    userDAO.friendCount(userID, function(err, result){
        if(err){
            count[0] = null;
        }
        else{
            count[0] = result;
            userDAO.postCount(userID, function(err, result){
                if(err){
                    count[1] = null;
                }
                else{
                    count[1] = result;
                    res.status(200);
                    return res.send(count);
                }
            });
        }
    });

}

// export member functions for use elsewhere
module.exports = {

    createAccount,
    login,
    logout,
    updateProfile,
    getUserByID,
    getProfileByID,
    getProfileByUsername,
    sendFriendRequest,
    updateFriendRequest,
    fetchAllPendingRequests,
    removeFriend,
    getFriendProfiles,
    areFriends,
    searchUsername,
    getProfileCounts
    
}