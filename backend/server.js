const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const mongoose = require("mongoose");
const socket = require("socket.io");
const debug = require("debug")("node-angular");
const http = require("http");
const bycrpt = require("bcryptjs"); //npm install --save bcryptjs

//socket io auth
const socketAuth = require("socketio-auth");

//MODELS
const User = require("./models/user.model");
const Group = require("./models/group.model");
//const ChatMessage=require('./models/myMessage.model');
const SingleChat = require("./models/singleChat.model");

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
    //this is encrypting our password from the request
    //the second is salt0r ground which higher number means longer but more safer
    //the result of then is the hash encrypted...
    bycrpt.hash(req.body.password, 10).then(hash => {
      var mySingleChat = new SingleChat({
        messageStash: null,
        users: null
      });
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nickName: req.body.nickName,
        username: req.body.username,
        password: hash,
        chatOpened: [mySingleChat]
      });

      User.findOne({ username: user.username })
        .then(existingUser => {
          if (!existingUser) {
            console.log("user not existant yet so can create new user");

            //saving the user into the database
            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: "user created",
                  result: result
                });

                console.log("new user created: " + user);
              })
              .catch(err => {
                res
                  .status(500)
                  .json({ message: "Invalid Authentification credentials!" });
              });
          }
        })
        .catch(err => {
          console.log("Fail Authentificaiton");
          return callback(new Error("Invalid Authentification Credentials"));
        });

    });
  })
);

// creating a socket io here, it is a server type
const io = socket.listen(server);

function authenticate(socket, data, callback) {
  var username = data.username;
  var password = data.password;

  User.findOne({ username: username })
    .then(
      user => {
        //check if the user exists
        if (!user) {
          console.log("user not found");
          return callback(new Error("User not found"));
        }
        bycrpt.compare(password, user.password, function(err, res) {
          // if password is correct, i want to note to server by console log
          if (res) {
            console.log("Authentification Valid");
            //ayth1) create token during authentication
            const token = jwt.sign(
              //based on input data of your choice which will be encrypted
              { email: user.email, userId: user._id },
              //this is the extra piece of randomfyer to token
              "my super duper secret code",
              //when it should expire
              { expiresIn: "1h" }
            );
            //ayth2) send token back to client by changing socket headers
            socket.ryantoken=token;
            //console.log(token) both are same!!
            //console.log(socket.handshake.headers.token);
            return callback(null, bycrpt.compare(password, user.password));
          } else {
            console.log("Authentification Fail");
          }
        });

        // returns true or false checking if the user's password is correct
        // return callback(null,bycrpt.compare(password,user.password));
      }
      //catch any errors
    )
    .catch(err => {
      console.log("Fail Authentificaiton");
      return callback(new Error("Invalid Authentification Credentials"));
    });
}

//called after authenticate is complete : it is what is avaliable after authentification functions for the users
function postAuthenticate(socket, data) {
  var username = data.username;
  // keeping track on the current user
  User.findOne({ username: username }).then(user => {
    socket.client.user = user;

    // console.log(socket.client.user)
    // emitting a list of all the users so that client can display these users
    User.find().then(allUsers => {
      const currentUser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        nickName: user.nickName
      };
      //ayth2b) only continue authenticated user/send users data if token exists
      if(socket.ryantoken){
        console.log(socket.ryantoken)
          //ayth2) send token back to client by changing socket headers
        socket.emit("get all users", currentUser, allUsers, socket.ryantoken );
      }
    });

    //gzo1. on sign in, userA socket joins own room (room + userAId)
    socket.join("room" + user._id);

    //  Opening 1-1 CHATS
    //  method to join a 1-1 chat
    socket.on("one to one chat", (userId, friendId) => {
      if(Boolean(checkToken(socket.ryantoken,socket.client.user._id)==false)){
        console.log('User authentification Error');
        return;
      }

      //1) find user
      User.findOne({ _id: userId })
        .then(_user => {
          //check if the user exists
          if (!_user) {
            console.log("user not found");
            return callback(new Error("User not found"));
          }

          //2) FIND IF FRIEND EXISTS
          User.findOne({ _id: friendId }).then(_friend => {
            //check if the user exists
            if (!_friend) {
              console.log("user not found");
              return callback(new Error("User not found"));
            }
            //friend or user first
            var chatSearchName;

            //2b) Querying or creating a single chat will be based on who's id is greater so that only one chat is created
            //between users
            if (friendId > userId) {
              chatSearchName = [_friend, _user];
            } else {
              chatSearchName = [_user, _friend];
            }

            //3) find a single chat where the user's array list is made of the user and friend
            SingleChat.findOne({ users: chatSearchName })
              .then(_chat => {
                //if no error, check if chat exists
                if (!_chat) {
                  //console.log("userId");

                  // console.log("chat doesn't exist")
                  //if it doesn't exist, create a new chat
                  const newSingleChat = new SingleChat({
                    messageStash: [
                      {
                        creator: {
                          _id: _user._id,
                          firstName: _user.firstName,
                          lastName: _user.lastName,
                          nickName: _user.nickName
                        },
                        content: "We have just began the best friendship ever!",
                        time: new Date()
                      }
                    ],
                    users: chatSearchName
                  });
                  //4)save new chat
                  newSingleChat
                    .save()
                    .then(res => {
                      connectAndSendChat(socket, friendId, _friend, _user, res);
                      //console.log(res);
                    })
                    .catch(err => {
                      console.log(err.message);
                    });
                }
                //5) unless the chat already exists then, open up the socket so that the users may talk
                else {
                  connectAndSendChat(socket, friendId, _friend, _user, _chat);
                }
              })
              .catch(err => {
                if (err) {
                  console.log(err.message);
                  return callback(new Error("Chat Invalid Search"));
                }
              });
          });
        })
        .catch(err => {
          console.log(err);
          // return callback(new Error("Invalid Authentification Credentials"))
        });
    });

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

    //gzo7. server: socket on catches
    socket.on(
      "send single message to room",
      (userId, friendId, message, chatId) => {
        //ayth2b) verify token... if the token and the request's userid the same.
        if(Boolean(checkToken(socket.ryantoken,socket.client.user._id)==false)){
          console.log('User authentification Error');
          return;
        }
        //1) find user
        User.findOne({ _id: userId }).then(_user => {
          //check if the user exists
          if (!_user) {
            console.log("user not found");
            return callback(new Error("User not found"));
          }

          //2) FIND IF FRIEND EXISTS
          User.findOne({ _id: friendId }).then(_friend => {
            //check if the user exists
            if (!_friend) {
              console.log("user not found");
              return callback(new Error("User not found"));
            }
            //friend or user first
            var chatSearchName;

            //2b) Querying or creating a single chat will be based on who's id is greater so that only one chat is created
            //between users
            if (friendId > userId) {
              chatSearchName = [_friend, _user];
            } else {
              chatSearchName = [_user, _friend];
            }

            //search using chatId the chat and store into database

            //3) find a single chat where the user's array list is made of the user and friend
            SingleChat.findOne({ users: chatSearchName }).then(_chat => {
              //if no error, check if chat exists
              if (!_chat) {
                //if it doesn't exist, create a new chat
                const newSingleChat = new SingleChat({
                  messageStash: [
                    {
                      creator: _user,
                      content: "We have just began the best friendship ever!",
                      time: new Date()
                    }
                  ],
                  users: chatSearchName
                });
                //4)save new chat
                newSingleChat
                  .save()
                  .then(res => {
                    console.log(res);
                  })
                  .catch(err => {
                    console.log(err.message);
                  });
              }
              //5) unless the chat already exists then, open up the socket so that the users may talk
              else {
                const newMessage = {
                  creator: {
                    _id: _user._id,
                    firstName: _user.firstName,
                    lastName: _user.lastName,
                    nickName: _user.nickName
                  },
                  content: message.content,
                  time: new Date()
                };
                _chat.messageStash.push(newMessage);
                //gzo8. server saves msg to database.
                _chat
                  .save()
                  .then(result => {
                    // console.log(result);
                  })
                  .catch(err => {
                    console.log(err.message);
                  });

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
            });
          });
        });
      }
    );

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

      console.log("Authorized user joined room " + groupChatName);
      // adding the client to the room if not already in it

      socket.join("room" + groupChatName);

      // // chatRoom emits to roomOne clients an event
      // // event: new user connected: passes name as a parameter
      chatRoom
        .to("room" + groupChatName)
        .emit("new user connected one", name, groupChatName);
    });
    //sending a chat message
    socket.on("send chat message one", (msg, groupChatName) => {
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
      chatRoom
        .to("room" + groupChatName)
        .emit("receive message one", msg, groupChatName);
    });

    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
  });
}

function disconnect(socket) {
  console.log(socket.id + " disconnected");
}

socketAuth(io, {
  authenticate: authenticate,
  postAuthenticate: postAuthenticate,
  disconnect: disconnect,
  timeout: 100000
});



// ayth2b) verify token... if the token and the request's userid the same.
function checkToken(_token,currentUserId){
  try {
    //ayth6) server decodes token and compares the user's userid with the token's decoded userid
    //ayth6a) if good then can continue with action
    //ayth6b) else ??? return u failed
    const token = _token;
    // next will keep any fields created
    const decodedToken=jwt.verify(token, "my super duper secret code",
    );
    if(currentUserId==decodedToken.userId){
      return true;
    }
    else{
      return false;
    }

  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }

}
