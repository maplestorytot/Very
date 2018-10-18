const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser=require('body-parser');

const app = express();
const mongoose = require("mongoose");
const socket = require("socket.io");
const debug = require("debug")("node-angular");
const http = require("http");
const bycrpt = require("bcryptjs"); //npm install --save bcryptjs

//socket io auth
const socketAuth=require('socketio-auth');

//MODELS
const User=require('./models/user.model');
const Group=require('./models/group.model');
const ChatMessage=require('./models/myMessage.model');
const SingleChat=require('./models/singleChat.model');

// ryanchang
//yKoO03VrsDCfB1Ym
mongoose
  .connect(
    "mongodb+srv://ryanchang:yKoO03VrsDCfB1Ym@mercy-ot4et.mongodb.net/test?retryWrites=true"
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("connection failed");
  });

//when recieving a port through environment variable or setting up portchecking if the port is valid
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

//checks errors and exits
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//console logs that we're listening for requests
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

//setting up port
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

//start the server using express app as parameter
const server = http.createServer(app);
//checking if anything is wrong when starting server
server.on("error", onError);
server.on("listening", onListening);
//listen for requests
//server.listen(port);
// 3000
server.listen(port);

app.use((req, res, next) => {
  //allows data no matter what domain it comes from
  res.append("Access-Control-Allow-Origin", "http://localhost:4200");
  //can allow these extra headers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Request-With,Content-Type,Accept,Authorization"
  );
  res.append(
    "Access-Control-Allow-Headers",
    "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  //always should have options to check if post request is valid...
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PATCH,OPTIONS,PUT');

  res.append("Access-Control-Allow-Credentials", true);

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/api/user',router.post("/signup",(req,res,next)=>{
  console.log(req.body.username);
  //this is encrypting our password from the request
 //the second is salt0r ground which higher number means longer but more safer
 //the result of then is the hash encrypted...
bycrpt.hash(req.body.password,10).then(hash=>{
 const user =new User({
   firstName:req.body.firstName,
   lastName:req.body.lastName,
   nickName:req.body.nickName,
   username:req.body.username,
   password:hash
 });
 //saving the user into the database
 user.save().then(result=>{
   res.status(201).json({
     message:"user created",
     result:result
 });
 console.log("new user created: " + user)
 }).catch(err=>{
   res.status(500).json({message:'Invalid Authentification credentials!'});
 })

})
}))


// creating a socket io here, it is a server type
const io = socket.listen(server);

// io.on("connection", function(socket){
//   console.log(socket.id+ " joined");
//   socket.on("authentication", authenticate);
// });




function authenticate(socket, data,callback){
  var username=data.username;
  var password=data.password;
  console.log(username + password)

  User.findOne({username:username}).then(user=>{
    //check if the user exists
    if (!user){
      console.log("user not found")
      return callback(new Error ("User not found"));
    }
    const validAuth=bycrpt.compare(password,user.password)
    bycrpt.compare(password,user.password,function(err,res){
        // if password is correct, i want to note to server by console log
    if(res){
      console.log('Authentification Valid')
      return callback(null,bycrpt.compare(password,user.password));

    }
    else{
      console.log('Authentification Fail')
    }
    });

   // returns true or false checking if the user's password is correct
    // return callback(null,bycrpt.compare(password,user.password));
  }
  //catch any errors
  ).catch(err=>{
    console.log("Fail Authentificaiton")
    return callback(new Error("Invalid Authentification Credentials"))
  })
}

//what is avaliable after authentification functions for the users
function postAuthenticate(socket, data){
  var username = data.username;
  User.findOne({username:username}).then(user=>{
    socket.client.user=user;
    console.log(user)


// creating a name space here, it is like sub server type
// like localhost/chatRoom
// // so that only in this url will things be performed
var chatRoom = io.of("/");
// var chatRoom = io.of("/chatRoom");


// // when the name space sub server is connected by a client...
// // clients are a socket
// chatRoom.on("connection", client => {
//   // sockets' functions...
  //this is the joining a specific room within the name space
  socket.on("join room one", (name, groupNumber) => {
    console.log('Authorized user joined room '   + groupNumber)
    // socket.emit('new user connected one', name,groupNumber)
    // adding the client to the room
    socket.join("room" + groupNumber);
    // // chatRoom emits to roomOne clients an event
    // // event: new user connected: passes name as a parameter
    chatRoom.to("room" + groupNumber).emit("new user connected one", name, groupNumber);
  });
  //sending a chat message
  socket.on("send chat message one",( msg,groupNumber) => {
    //add to db message

    //sends meesage to all those connected to roomOne
    chatRoom.to("room" + groupNumber).emit("receive message one", msg, groupNumber);
  });


  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});



  // }
  // )
}

function disconnect(socket){
  console.log(socket.id+' disconnected')
}

socketAuth(io,{
  authenticate:authenticate,
  postAuthenticate:postAuthenticate,
  disconnect:disconnect,
  timeout:10000
})













// var chatRoom = io.of("/");
// // var chatRoom = io.of("/chatRoom");


// // // when the name space sub server is connected by a client...
// // // clients are a socket
// // chatRoom.on("connection", client => {
// //   // sockets' functions...
//   //this is the joining a specific room within the name space
//   socket.on("join room one", (name, groupNumber) => {
//     console.log('Authorized user joined room '   + groupNumber)
//     // adding the client to the room
//     socket.join("room" + groupNumber);
//     // chatRoom emits to roomOne clients an event
//     // event: new user connected: passes name as a parameter
//     chatRoom.to("room" + groupNumber).emit("new user connected one", name, groupNumber);
//   });
//   //sending a chat message
//   socket.on("send chat message one",( msg,groupNumber) => {
//     //add to db message


//     //sends meesage to all those connected to roomOne
//     chatRoom.to("room" + groupNumber).emit("receive message one", msg, groupNumber);
//   });
