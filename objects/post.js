class Post{

    constructor(postID, coords, media, title, desc, date, priv, profile, reacts){

        // set the ID of the post
        this.postID = postID;
        // touple containing the lat and long the post was made at
        this.coords = coords;
        // set media to contain an image array
        this.media = media;
        // set title
        this.title = title;
        // post description
        this.desc = desc;
        // date post was made
        this.date = date;
        // privacy setting
        this.priv = priv;
        // profile of the user who created the post
        this.profile = profile;
        // assoc array of what reacts have been left by who
        this.reacts = reacts;
    }



}

module.exports = Post;