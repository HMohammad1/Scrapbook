class React{

    constructor(icon){

        this.icon = icon;
        this.left_by = [];

    }

    addUser(userID){
        this.left_by.push(userID);
    }

}

module.exports = React;