const { render } = require("ejs");

class mapPin{

    // create user object w/ existing profile
    constructor(postID, post, coords){
        
        this.postID = postID;
        this.coords = coords;        
        // render html
        this.HTML = render("partials/post/mapPin", {post: post});
        
    }




}

module.exports = mapPin