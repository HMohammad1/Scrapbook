const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});
const express = require("express");
var formidable = require("express-formidable");
var session = require("express-session");
//creating app
const app = express();

const {config} = require('dotenv');

// get environment
config({path: `.env.${process.env.NODE_ENV}`});

// for parsing form data
app.use(formidable());

// setup session to track user details
app.use(
  session({
    secret: "f00bar",
    user: false,
    maxAge: 60 * 1000 * 60 * 24, //24HRS
    saveUninitialized: true,
    resave: true
  })
);

//handling static HTML and EJS templates
//app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {user: req.session.user}); //no need for ejs extension
});

//route for login
app.get("/login", (req, res) => {
  res.render("login");
});

//route for signup
app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/application", (req, res) => {
    res.render("application");
});

app.get("/addPost", (req, res) => {
    res.render("addPost");
});


app.get("/myprofile", (req, res) =>{

  if(typeof(req.session.user !== 'undefined')){
    res.render("index", {user: req.session.user, sidebar: "myprofile"});
  }
  else{
    res.render("index");
  }
});

//menu items
app.get("/API/myprofile", (req, res) =>{
    if(typeof(req.session.user) !== 'undefined'){
      res.status(200);
      return res.render('partials/profile', {user: req.session.user});
    }
    else{
      res.status(404);
    }
});


//dynamic routing for public files
app.use(express.static(__dirname + "/public"));


const router = require("./API/routes.js");
app.use(router);

// server global
var server;

// try to assign port value
const port = process.argv[2] || process.env.APP_PORT || 3000;

const host = process.env.APP_HOST || 'localhost';

// start listening at env port
function startServer(){
  //make the app listen on port
  server = app.listen(port, host, () => {
    console.log(`Scrapmap listening @ http://${host}:${port}/`);
  });
}

// kills currently running server
function killServer(){
  server.close(() =>{
    //console.log(`Scrapmap no longer listening @ http://${host}:${port}/`);
  });
}

// handle commands
function cmd() {
  readline.question("> ", (res) => {
    if (res)
      switch (res.toLowerCase()) {
        case "exit":
          // Stop http server
          server.close(() => {
            // End process
            process.exit(0);
          });
          break;
        // Add other commands here
      }

    cmd();
  });
}

startServer();
cmd();

// export functions for use elsewhere
module.exports = {
  startServer,
  killServer
}
