const express= require('express');
const path= require('path');
const app = express();
const mongoose=require('mongoose');
const socket=require('socket.io');
const debug = require("debug")("node-angular");
const http = require("http");

// ryanchang
//yKoO03VrsDCfB1Ym
mongoose.connect('mongodb+srv://ryanchang:yKoO03VrsDCfB1Ym@mercy-ot4et.mongodb.net/test?retryWrites=true').then(()=>{
    console.log("connected to database");
    })
    .catch(()=>{
        console.log('connection failed');
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




app.use((req,res,next)=>{
  //allows data no matter what domain it comes from
  res.append('Access-Control-Allow-Origin' , 'http://localhost:4200');
  //can allow these extra headers
  res.setHeader('Access-Control-Allow-Headers','Origin,X-Request-With,Content-Type,Accept,Authorization') ;
  res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  //always should have options to check if post request is valid...
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PATCH,OPTIONS,PUT');
  res.append('Access-Control-Allow-Credentials', true);

  next();
});




// creating a socket io here, it is a server type
const io = socket.listen(server);

// creating a name space here, it is like sub server type
// like localhost/chatRoom
// so that only in this url will things be performed
var chatRoom=io.of('/chatRoom');
// when the name space sub server is connected by a client...
// clients are a socket
chatRoom.on('connection',(client)=>{
// sockets' functions...

  //this is the joining a specific room within the name space
  client.on('join room one', (name)=>{
    // adding the client to the room
    client.join('roomOne');
    // chatRoom emits to roomOne clients an event
    // event: new user connected: passes name as a parameter
    chatRoom.to('roomOne').emit('new user connected one', name);
  })
  //sending a chat message
  client.on("send chat message one",(msg)=>{
    //add to db message
    //sends meesage to all those connected to roomOne
    chatRoom.to('roomOne').emit('receive message one',msg);
  })



  //chat room 2
  client.on('join room two', (name)=>{
    client.join('roomTwo');

    chatRoom.to('roomTwo').emit('new user connected', name);
  })
  client.on("send chat message two",(msg)=>{

    chatRoom.to('roomTwo').emit('receive message two',msg);
  })




  client.on('disconnect', function () {
    console.log('user disconnected');
  });

})

// chatRoomOne.on('connection',function(socket){

//   console.log('new user connected: ' + name)
//   console.log(name);
//   socket.emit('new user connected: ' + name)

//   socket.on('chat message', function(msg){
//     console.log(msg);
//     io.emit('chat message', msg);

//   });

//   socket.on('disconnect', function () {
//     console.log('user disconnected');
//   });

// })

