const userDAO = require("../DAOs/userDAO.js");
class Profile{

    friendCount;
    postCount;

    constructor(userID, username, display, fname, lname, pfp, bio, colour){

        this.userID = userID;
        this.username = username;
        this.display = display;
        this.fname = fname;
        this.lname = lname;
        this.bio = bio;
        this.pfp = pfp;
        this.colour = colour;

        this.friendCount = this.getFriendCount();
        this.postCount = this.getPostCount();
    }

    getFriendCount() {
        userDAO.friendCount(this.userID, function(err, result){
            if(err){
                return null;
            }
            else{
                return result;
            }
        });

    }

    getPostCount(){
        userDAO.postCount(this.userID, function(err, result){
            if(err){
                return null;
            }
            else{
                return result;
            }
        });
    }

}

module.exports = Profile;