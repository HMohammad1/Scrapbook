       //---------- Swear Words replacement -----//
       function validateUsername() {

        <textarea id = "description"></textarea>
        const  textarea = document.getUserByID('description');
        let swearWords = /arse | arsehead | arsehole |  ass |  asshole | bastard | bitch |  bloody |  bollocks | brotherfucker | bugger | bullshit | child-fucker | Christ on a bike | Christ on a cracker | cock | cocksucker | crap | cunt | damn | damn it | dick | dickhead | dyke | fatherfucker | frigger | fuck | goddamn | godsdamn | hell | holy shit | horseshit | in shit | Jesus Christ | Jesus fuck | Jesus H. Christ | Jesus Harold Christ | Jesus wept | Jesus, Mary and Joseph | kike |  motherfucker | nigga | nigra | piss | prick | pussy | shit | shit ass | shite | sisterfucker  | slut  | son of a bitch  | son of a whore  | spastic  | sweet Jesus  | turd | twat | wanker/gi ;
        let userComm1 = textarea.value;
        let userComm2 = userComm1.replace(swearWords, '*****');
        document.getElementById('description').value = userComm2;

        if (textarea.value.search(swearWords) <= 0 ){
            return true;
        }
        else {
            console.log("Words are not replaced !");
            return false;
        }

    }
    
           //---------- Swear Words replacement -----//
    // it('positive test replacement swear words', done =>{

    //     <textarea id = "userComment"></textarea>
    //     const  textarea = document.getUserByID('userComment');
    //     let swearWords = /arse | arsehead | arsehole |  ass |  asshole | bastard | bitch |  bloody |  bollocks | brotherfucker | bugger | bullshit | child-fucker | Christ on a bike | Christ on a cracker | cock | cocksucker | crap | cunt | damn | damn it | dick | dickhead | dyke | fatherfucker | frigger | fuck | goddamn | godsdamn | hell | holy shit | horseshit | in shit | Jesus Christ | Jesus fuck | Jesus H. Christ | Jesus Harold Christ | Jesus wept | Jesus, Mary and Joseph | kike |  motherfucker | nigga | nigra | piss | prick | pussy | shit | shit ass | shite | sisterfucker  | slut  | son of a bitch  | son of a whore  | spastic  | sweet Jesus  | turd | twat | wanker/gi ;
    //     let userComm1 = textarea.value;
    //     let userComm2 = userComm1.replace(swearWords, '*****');
    //     document.getElementById('userComment').value = userComm2;

    //     if (textarea.value.search(swearWords) <= 0 ){
    //         done();
    //     }
    //     else {
    //         console.log("Words are not replaced !");
    //         done(err);
    //     }

    // }
    
    // );
