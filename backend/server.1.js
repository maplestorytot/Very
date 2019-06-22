const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const request = require("request");
const app = express();
const mongoose = require("mongoose");
const socket = require("socket.io");
const debug = require("debug")("node-angular");
const http = require("http");
const bycrpt = require("bcryptjs"); //npm install --save bcryptjs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//socket io auth
// const socketAuth = require("socketio-auth");

//MODELS
const User = require("./models/user.model");
//const ChatMessage=require('./models/myMessage.model');
const Chat = require("./models/chat.model");

// ryanchang
//yKoO03VrsDCfB1Ym
// mongoose
//   .connect(
//     "mongodb+srv://ryanchang:yKoO03VrsDCfB1Ym@mercy-ot4et.mongodb.net/test?retryWrites=true"
//   )
//   .then(() => {
//     console.log("connected to database");
//   })
//   .catch(() => {
//     console.log("connection failed");
//   });
var dbPort = process.env.PORT || 27017;

// Current AWS URL
var dbURL = 'mongodb://localhost:' + dbPort + '/very';

// Connect to Database
mongoose.connect(dbURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('Connect to DB successfully');
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
  res.append("Access-Control-Allow-Origin", "*");
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
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,DELETE,PATCH,OPTIONS,PUT"
  );

  res.append("Access-Control-Allow-Credentials", true);

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  "/api/user",
  router.post("/signup", (req, res, next) => {
    console.log(req.body)
    //this is encrypting our password from the request
    //the second is salt0r ground which higher number means longer but more safer
    //the result of then is the hash encrypted...
    bycrpt.hash(req.body.password, 10).then(hash => {
  /*     var mySingleChat = new Chat({
        messageStash: null,
        users: null
      }); */
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email:req.body.username,
        password: hash/* ,
        chatOpened: [mySingleChat] */
      });
      console.log(user);
      User.findOne({ username: user.username })
        .then(existingUser => {
          if (!existingUser) {
            console.log("user not existant yet so can create new user");

            //saving the user into the database
            user
              .save()
              .then(result => {
                console.log("new user created: " + user);

                return res.status(201).json({
                  message: "user created",
                  result: result
                });

              })
              .catch(err => {
                console.log(err);
                return res
                  .status(500)
                  .json({ message: "Invalid Authentification credentials!" });
              });
          }else{
            throw new Error("user already made")
          }
        })
        .catch(err => {
          console.log("Fail Authentificaiton");
          return callback(new Error("Invalid Authentification Credentials"));
        });
    });
  })


);
app.use(
  "/api/group",
  router.post("/create-group"/* ,checkAuth */, (req, res, next) => {
    // req.body.users
    // req.userData.userID


  })
);

// creating a socket io here, it is a server type
const io = socket.listen(server);



io.on('connection', function (socket) {
  // Connection now authenticated to receive further events

  /* 
  data: username, password
  callback: to tell client if properly logged in
  */
  socket.on('authentication', function (data, callback) {
    //check token here
    var username = data.username;
    var password = data.password;

    User.findOne({ username: username })
      .then(
        function (user) {
          //check if the user exists
          if (!user) {
            console.log("user not found");
            return callback(new Error("User not found"));
          }
          bycrpt.compare(password, user.password, function (err, res) {
            // if password is correct, i want to note to server by console log
            if (res) {
              console.log("Authentification Valid");
              //ayth1) create token during authentication
              const token = jwt.sign(
                { email: user.email, userId: user._id },
                "my super duper secret code",
                { expiresIn: "1h" }
              );
              //ayth2) send token back to client by changing socket headers
              socket.handshake.query.token = token;
              socket.client.user = user;
              console.log(socket.client.user)
              //console.log(token) both are same!!
              //console.log(socket.handshake.headers.token);
              postAuthenticate(socket, user);
              return callback(socket.handshake.query.token, true,user);
            } else {
              console.log("Authentification Fail");
              return callback(null, false,null);
            }
          });


        }
      )
      .catch(err => {
        console.log("Fail Authentificaiton");
        return callback(new Error("Invalid Authentification Credentials"));
      });


  })

  //  Opening 1-1 CHATS
  // socket.on("one to one chat", (userId, friendId) => {
  socket.on("send friend request", (friendId, callback) => {
    let alreadyFriends =false;
    if(socket.client.user.friends){
      socket.client.user.friends.forEach(friend => {
        if(friend._id==friendId){
          alreadyFriends=true;
        }
      });
    }

    // console.log(socket.client.user.friends)
    if (alreadyFriends) {
      console.log('These two people are already friends');
      return callback("Already friends")
    } else {
      User.findById(friendId, function (err, friend) {
        if (err) {
          return callback(err);
        }
        let alreadySentRequest = false;
        friend.friendRequests.forEach((req)=>{
          if(req._id==socket.client.user._id.toString()){
            alreadySentRequest=true;
          }
        })
        console.log(alreadySentRequest);
        if(alreadySentRequest){
          return callback("Already sent friend request")
        }

        console.log('didnt send request')
        // if (friend.friendRequests.toString().includes(socket.client.user._id)) {
        //   return callback("Already sent friend request")
        // } else {

          friend.friendRequests.push({
            _id:socket.client.user._id,
            firstName:socket.client.user.firstName,
            lastName:socket.client.user.lastName
          });
          friend.save(function (err, updFriend) {
            if (err) {
              return callback(err);
            } else {
              // Join friend's room and notify friend
              socket.join("room" + friend._id);
              socket.to("room" + friend._id).emit("receive friend request", {
                _id:socket.client.user._id,
                firstName:socket.client.user.firstName,
                lastName:socket.client.user.lastName
              });
              return callback("Friend request sent");
            }
          });
        // }
      })
    }
  })
  socket.on("accept friend request",  async (friendId, callback)=> {
    console.log(friendId)
    try{
      const user =  await User.findById(socket.client.user._id);
      const friend = await User.findById(friendId);
      let inFriendRequests= false;
      user.friendRequests.forEach((req)=>{
        if(req._id==friendId){
          inFriendRequests=true;
        }
      })
      if(inFriendRequests){
        const chat = await Chat.create({
          messageStash: [
            {
              creator: {
                _id: user._id,
                firstName: `${friend.firstName} and ${user.firstName}`,
                lastName: `${friend.lastName} and ${user.lastName}`
              },
              content: `${friend.firstName} and ${user.firstName} have started the best friendship ever!`,
              datetime: Date.now()
            }
          ],
          users:[{
            _id:user,
            firstName:user.firstName,
            lastName:user.lastName
          }, {
            _id:friend,
            firstName:friend.firstName,
            lastName:friend.lastName
          }]
        })
        user.friendRequests.forEach((req, index)=> {
          if (req._id == friendId) {
            user.friendRequests.splice(index, 1);
          }
        })
  
        user.friends.push({
          _id:friendId,
          firstName:friend.firstName,
          lastName:friend.lastName
        });
        friend.friends.push(
          {
            _id:user._id,
            firstName:user.firstName,
            lastName:user.lastName
          }
        );
        friend.chatOpened.push(chat);
        friend.save(function(err, updFriend){
          user.chatOpened.push(chat);
          user.save(function(err, updUser) {
            // if (err) {
            //   return callback(err);
            // } else {
              socket.join("room" + chat._id);
              // connect the friend to the room!!
              socket.to("room" + friend._id).emit("someone accepted friend request",friend.friends,friend.friendRequests);
              socket.client.user = updUser;
              return callback(updUser.friends) 
                  // }
              })
          // if (err) {
          //   return callback(err);
          // }
        })
        
      }else{
        return callback('Error');

      }
 

      
    }catch(err){
      console.log(err.message);
    } 
    // User.findById(socket.client.user._id,function(err,user){
    //   if (user.friendRequests.toString().includes(friendId)) {
    //     user.friendRequests.forEach(function (req, index) {
    //       if (req == friendId) {
    //         user.friendRequests.splice(index, 1);
    //         user.friends.push(friendId);
    //         User.findById(friendId, function (err, friend) {

    //           Chat.create({
    //             messageStash: [
    //               {
    //                 creator: {
    //                   _id: user,
    //                   firstName: `${friend.firstName} and ${user.firstName}`,
    //                   lastName: `${friend.lastName} and ${user.lastName}`
    //                 },
    //                 content: `${friend.firstName} and ${user.firstName} have started the best friendship ever!`,
    //                 datetime: Date.now()
    //               }
    //             ],
    //             users:[{
    //               _id:user,
    //               firstName:user.firstName,
    //               lastName:user.lastName
    //             }, {
    //               _id:friend,
    //               firstName:friend.firstName,
    //               lastName:friend.lastName
    //             }]
    //           }, function (err, chat) {
    //             if(err){

    //             }else{
    //               friend.friends.push(user._id);
    //               friend.chatOpened.push(chat);
    //               friend.save((err, updFriend) => {
    //                 if (err) {
    //                   return callback(err);
    //                 }
    //                 user.chatOpened.push(chat);
    //                 user.save((err, updUser) => {
    //                   if (err) {
    //                     return callback(err);
    //                   } else {
    //                       socket.join("room" + chat._id);
                    
    //                     console.log(updUser)
    //                     // connect the friend to the room!!
    //                     socket.to("room" + friend._id).emit("someone accepted friend request",'updUser');
    //                     socket.client.user = updUser;
    //                     return callback('updUser')
    //                   }
    //               })
    //               })
                  

                
    //             }
    //           })
              
  
    //         })
    //       }


    //     })
    //   }
    // })
  })
  socket.on("delete friend request", (friendId,callback)=>{
    User.findById(socket.client.user._id,function(err,user){
      if(err){
        return callback(false);
      }else{
        user.friendRequests.splice(user.friendRequests.indexOf(friendId),1);
        user.save(function(err,updUser){
          if(err){
            return callback(false);
          }
          socket.client.user=updUser;
          return callback(true)
        })
      }
    })
  })
  
  socket.on("get chat", (userId,friendId, callback) => {
    console.log(userId,friendId)
    // Chat.findById('5d0d4128b484432198cb9a51',function(err,chat){
    //   console.log(chat);
    // })
    Chat.findOne(
      /* users:{$elemMatch:{_id:userId}} */
      {$and:[{"users._id":friendId},{"users._id":userId}]
    },function(err,chat){
      if(err){
        console.log(err);
        return callback(err);
      }
      else if(!chat){
        console.log(chat)
        return callback()
      }
      else{
        // console.log(chat);
        let authorized =false;
        chat.users.forEach((user)=>{
          if(user._id==socket.client.user._id.toString()){
            authorized=true;
          }
        })
        if(authorized){
          return callback(chat);
        }else{
          console.log('chat not authorized');
        }
      }
    })
  })
  //gzo7. server: socket on catches
  socket.on(
    // "send single message to room",
    "send single message to chat",
    (message, chatId,callback) => {
      console.log(chatId);
      Chat.findById(chatId,function(err,chat){
        if(err){
          return callback(err);
        }else if(!chat){
          return callback();
        }else{
          // Ensure socket is part of the chat
          let authenticated =false;
          chat.users.forEach((user)=>{
            if(user._id==socket.client.user._id.toString()){
              authenticated=true;
            }
          })
          if(authenticated){
            const newMessage= {
              creator:{
                _id:socket.client.user._id,
                firstName:socket.client.user.firstName,
                lastName:socket.client.user.lastName
              },
              content:message.content,
              datetime:message.datetime
            }
            chat.messageStash.push(newMessage);
            chat.save(function(err,updChat){
              if(err){
                return callback(err);
              }else{
                //group chat send to group id
                  io.to("room" + chat._id).emit("receive single message to chat", newMessage,chat._id,chat.users);
                  return callback("Message sent successfuly");
              }
              
            })
          }else{
            callback('not authenticated');
          }
        }
      })

    }
  );

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

const postAuthenticate = function (socket, user) {
  
  // 	On login: join all rooms between you and friends, and the group rooms and your own room
  socket.join("room" + user._id);
  user.chatOpened.forEach(function (chat) {
      socket.join("room" + chat._id);
  });
  // console.log(socket)
  // console.log(socket.adapter.rooms)
  // console.log(socket.rooms)
  User.find(function(err,users){
      socket.emit("get all users",users);
      // Add send back friends to Client
      let friendsAndErrors = [];
      getEachFriendAsyncLoop(0, user.friends, friendsAndErrors, function () {
        socket.emit("get friends", friendsAndErrors);
      })
  })

}
const getEachFriendAsyncLoop = function (i, friends, friendsAndErrors, callback) {
  if (i < friends.length) {
    User.findById(friends[i]._id, function (err, friend) {
      if (err) {
        friendsAndErrors.push(err);
      }
      if (!friend) {
        friendsAndErrors.push(`Friend of id: ${friendIDS[i]._id} is missing.`);
      } else {
        friendsAndErrors.push(friend);
      }
      getEachFriendAsyncLoop(i + 1, friends, friendsAndErrors, callback);
    })
  } else {
    callback();
  }
}


function connectAndSendChat(socket, friendId, _friend, _user, _chat) {
  //gzo3. Server: socket on catches ... adds userB socket to (room + userAId)
  socket.join("room" + friendId);
  //gzo4. server sends chat info to userB
  // note: only sending parts of the users for security
  io.to(`${socket.client.id}`).emit(
    "friend join single chat",
    {
      _id: _friend._id,
      firstName: _friend.firstName,
      lastName: _friend.lastName,
      nickName: _friend.nickName
    },
    {
      _id: _user._id,
      firstName: _user.firstName,
      lastName: _user.lastName,
      nickName: _user.nickName
    },
    _chat._id,
    _chat.messageStash
  );
}


function findSocketWithinRoom(_friend){
      //gzo9a.finds socket that matches userA socket id with userA id within (room + userAId)
    /* how it works: for memberId used to get ids of sockets connected to userA's room, then,
      if statement filters out the ones that you aren't supposed to send to, ie not userA or userB
      */

    for (var memberId in chatRoom.adapter.rooms[
      "room" + _friend._id
    ].sockets) {
      if (
        memberId == socket.client.id ||
        _friend.id == io.clients().sockets[memberId].client.user._id
      ) {
        //gzo9b. server send msg to userA, userB socket directly by just memberid
        io.to(`${memberId}`).emit(
          "single chat send message",
          _friend._id,
          _user._id,
          _chat._id,
          newMessage
        );
      }
    }
}


