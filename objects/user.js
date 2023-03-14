class User{

    // create user object w/ existing profile
    constructor(userID, email, profile){
        
        this.userID = userID;
        this.email = email;
        this.profile = profile;
        // TESTING VARS ONLY
        this.coords = [55.909095, -3.319584];
        
    }

    getCoords() {
        
        return this.coords;

    }

    updateCoords(lat, long){

        this.coords = [lat, long];

    }


}

module.exports = User