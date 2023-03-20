const ejs = require("ejs");
const path = require('path');
class mapPin{

    // create user object w/ existing profile
    constructor(postID, post, coords){
        this.postID = postID;
        this.coords = coords;
        this.HTML = false;

        let temp;
        // render html -- BASICALLY HELD TOGETHER WITH DUCT TAPE 
        this.renderHTML(post, function(result){

            temp = result;

        });
        this.HTML = temp;
    }

    renderHTML(post, callback){
        ejs.renderFile(path.join(__dirname, "../views/partials/post/postIcon.ejs"), {post: post}, function(err, str){

            if(err){
                console.log(err);
                return callback(false);
            }
            else{
                return callback(str); 
            }
        });
    }


}

module.exports = mapPin