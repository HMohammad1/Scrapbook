class Profile{

    constructor(userID, username, display, fname, lname, pfp, bio, colour){

        this.userID = userID;
        this.username = username;
        this.display = display;
        this.fname = fname;
        this.lname = lname;
        this.bio = bio;
        this.pfp = pfp;
        this.colour = colour;

    }
}

module.exports = Profile;