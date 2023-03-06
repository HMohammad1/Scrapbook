class Request{


    constructor(reqID, status, sent, profile){

        this.reqID = reqID;
        this.status = status;
        this.sent = sent;
        // the profile of the person who is not the active user
        this.profile = profile;

    }

    calcTime(){
        
    }


}
module.exports = Request;