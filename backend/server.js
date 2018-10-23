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
//const ChatMessage=require('./models/myMessage.model');
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


  //this is encrypting our password from the request
 //the second is salt0r ground which higher number means longer but more safer
 //the result of then is the hash encrypted...
bycrpt.hash(req.body.password,10).then(hash=>{

  var mySingleChat=new SingleChat({
    messageStash:null,
    users:null
  })
 const user =new User({
   firstName:req.body.firstName,
   lastName:req.body.lastName,
   nickName:req.body.nickName,
   username:req.body.username,
   password:hash,
   chatOpened:[mySingleChat]
   });

 User.findOne({username:user.username}).then(existingUser=>{
  if (!existingUser){
    console.log("user not existant yet so can create new user")

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




  }
 }).catch(err=>{
  console.log("Fail Authentificaiton")
  return callback(new Error("Invalid Authentification Credentials"))
})
// console.log(mySingleChat);
  //   SingleChat.insert({messageStash:mySingleChat.messageStash,users:mySingleChat.users}).then(result=>{
  //     res.status(201).json({
  //       message:"chat created",
  //       result:result
  //   });
  //   console.log("new chat created " + mySingleChat)
  // }).catch(err=>{
  //   res.status(500).json({message:'Invalid Authentification credentials!'});
  // })

})
}))


// creating a socket io here, it is a server type
const io = socket.listen(server);





function authenticate(socket, data,callback){
  var username=data.username;
  var password=data.password;

  User.findOne({username:username}).then(user=>{
    //check if the user exists
    if (!user){
      console.log("user not found")
      return callback(new Error ("User not found"));
    }
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
  // keeping track on the current user
  User.findOne({username:username}).then(user=>{
    socket.client.user=user;

    console.log(socket.client.user)
  // emitting a list of all the users so that client can display these users
  User.find().then(allUsers=>{

    socket.emit('get all users', user,allUsers);

  })

//  Opening 1-1 CHATS
//  method to join a 1-1 chat
socket.on("one to one chat",(userId,friendId)=>{
  //1) find user
  User.findOne({_id:userId}).then(_user=>{
    //check if the user exists
    if (!_user){
      console.log("user not found")
      return callback(new Error ("User not found"));
    }


    //2) FIND IF FRIEND EXISTS
    User.findOne({_id:friendId}).then(_friend=>{
      //check if the user exists
      if (!_friend){
        console.log("user not found")
        return callback(new Error ("User not found"));
      }

      //3) find a single chat where the user's array list is made of the user and friend
    SingleChat.findOne({users:[_user,_friend]}).then(_chat=>{

      //if no error, check if chat exists
       if(!_chat){
        console.log("userId");

        console.log("chat doesn't exist")
        //if it doesn't exist, create a new chat
        const newSingleChat=new SingleChat({
          messageStash:[
            {creator:_user,
                content:"We have just began the best friendship ever!",
                time:new Date()
              }],
          users:[_user._id,_friend._id]
        });
        //4)save new chat
        newSingleChat.save().then(res=>{
          console.log(res);
        }).catch(err=>{
          console.log(err.message)
        })

      }
      //5) unless the chat already exists then, open up the socket so that the users may talk
      else{
        console.log('chat exists!')
        // join the user to the room, which are named by the chat's id
        socket.join("room" + _chat._id);

        _chat.messageStash.push({creator:_user,
          content:"Ryan has joined the chat!",
          time:new Date()
        });
        // save updated  chat to database. could use update instead!
        _chat.save().then(result=>{
          console.log(result);
        }).catch(err=>{
          console.log(err.message);
        })



       // chatRoom emits to roomOne clients an event
      // event: new user connected: passes name as a parameter
      // chatRoom.to("room" + _chat._id).emit("new user connected one", name,  _chat._id);
      }
      // catch for errors
    }).catch(err=>{
      if(err){
        console.log(err.message);
        // return callback(new Error("Chat Invalid Search"))
      }
    })
    })
  }
  //catch any errors
  ).catch(err=>{
    console.log(err)
    // return callback(new Error("Invalid Authentification Credentials"))
  })
 })


















  //GROUP CHAT LOGIC:
// creating a name space here, it is like sub server type
// like localhost/chatRoom
// // so that only in this url will things be performed
var chatRoom = io.of("/");


// // when the name space sub server is connected by a client...
// // clients are a socket
// chatRoom.on("connection", client => {
//   // sockets' functions...
  //this is the joining a specific room within the name space
  socket.on("join room one", (name, groupChatName) => {

    // //first check if the group exists
    // Group.findOne({groupName:groupChatName}).then(groupChat=>{
    //   //if a current group chat under this name/id doesn't exist, make it
    //   if(!groupChat){

    //     const group=new Group({
    //       groupName:groupChatName,
    //       messageStash:new ChatMessage({creator:socket.client.user,
    //         content:"Welcome to a brand new chat, the start of something awesome!",
    //         time:new Date()
    //       })
    //     ,
    //     users:socket.client.user,
    //     password:"123"
    //     });
    //     // save the group to the database
    //     group.save().then(result=>{
    //     //   res.status(201).json({
    //     //     message:"group created",
    //     //     result:result
    //     // });


    //     console.log("new group created: " + group)
    //     }).catch(err=>{
    //       console.log(err.message)
    //       })
    //   }

    //   //if it already does exist, just do nothing

    // }).catch(err=>{
    //   console.log(err.message)
    // })















    console.log('Authorized user joined room '   + groupChatName)
    // adding the client to the room if not already in it

    socket.join("room" + groupChatName);

    // // chatRoom emits to roomOne clients an event
    // // event: new user connected: passes name as a parameter
    chatRoom.to("room" + groupChatName).emit("new user connected one", name, groupChatName);
  });
  //sending a chat message
  socket.on("send chat message one",( msg,groupChatName) => {

    // //add to db message
    // Group.findOne({groupName:groupChatName}).then(groupChat=>{
    //   //check if group chat exists
    //   if(!groupChat){
    //     console.log('group chat not found')
    //     return callback(new Error ("group chat not found"));

    //   }
    //   const newMessage=new ChatMessage({creator:socket.client.user,
    //     content:msg,
    //     time:new Date()
    //   })

    //   groupChat.messageStash=groupChat.messageStash+newMessage;

    // })
        //if it does exist, then just save a message


    //sends meesage to all those connected to roomOne
    chatRoom.to("room" + groupChatName).emit("receive message one", msg, groupChatName);
  });


  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});





}





function disconnect(socket){
  console.log(socket.id+' disconnected')
}

socketAuth(io,{
  authenticate:authenticate,
  postAuthenticate:postAuthenticate,
  disconnect:disconnect,
  timeout:100000
})






function security (){

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

}
