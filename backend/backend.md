Server.js

Group Chats:
- Inputs: 

authenticate if person is logged in 
  - click login
  SocketAuth will check if user is part of database
    allow access into socket's send functions

needs to add people to chat rooms/authenticate if person is part of a chat room
  - click join room with pass
  SocketAuth will check if user is part of group chat
    allow access into group chat's send functions

send message
  - click send message

store message into database
  each group chat has its own database that contains
    message that has user, timestamp, message

Send to group chat...
  through socket io to all users connected to the room
-----------------------------------------------------------------
---Retrival of messages when joining group chat
 
authenticate if person is logged in 
  - click login

needs to add people to chat rooms/authenticate if person is part of a chat room
  - click join room with pass

access database
  check tokenL, tokenR and then get messages

send those retrieved messages to the ONE user




Single Chat
authenticate if person is logged in 
  - log in with user name and pass
  SocketAuth will check if user is part of database
    allow access into socket's send functions

creating a new chat room between user x and user y
  - click on another person's user image which creates a chat box
  SocketAuth will check if user is part of chat box's users
    allow access into socket's send functions  
  1) check if chat has already been created
  2) if has been, retrieve messages
  3) send those retrieved messages to the ONE user

store message into database

send message
  will send to entire chat, eg which user's are currently connected to the chat box



Database:
group chats
  users list
  messages log
  password

messages
  user
  message string
  timestamp

user
  name
  lastname
  username
  password-- bycrpt//token

  either each chat will be store to check if the userid is within the chat has the tokenL and tokenR, which will be decodified to find the user id and check if part of users list

  unless socket io has a better way to check authorization



Front End:
Login page
Sign in page
group chat buttons
list of users, which are buttons that you can click to start up a chat between the users

chatbox





Server.js NOTES:
1) using a post html to create a user within the mongoose database
  -use bcrypt to encrypt the password

2) using socketauth for authentification
  -checks on the database username if they exist and if the password is correct



Front End: 

main.service.ts
  -does authentication there... sends











Goals:
Displaying all users
  client logs on
  gets list of all users displayed as a list
  clicking on a user will send a request to server
    -check user is actually authenticated
    -check if chat Group exists between two users
      -if yes: fetch the chat's top ten messages
      -if no: create a chat Group between the two users
    -now open to sending messages between the users 
      -sending a message adds it first to the database and then emits it to any sockets currently connected
    -if receiving a message: chat  box should pop up 

creating group chats




Structure of Namespace/rooms for individual Chats
General:
-each user has their own room which they connect to when logging on 
-whenever other users want to chat with them, they first connect to that user's room
-conecting with that room notifies all users, including the first user that a connection has been made
-they then create another room that is more specific between the two users, which is room (friendId+userId), where messages will be sent through


user = userA
friend=userB
Joining Single Chat Rooms: ABA
1. on sign in, userA socket joins own room (room + userAId)
2. Server:  UserB clicks on userA... adds UserB socket to (room + userAId)
3.  (userAId + userBId) create new room and add UserB socket to this room
4.//  UserB client socket emit userAId and userBId
3. Server: UserB socket emit to userA client socket (room + userAId) that UserB socket has joined the room
4. Client: userA socket on "create new one to one chat room" (friendId + userId) add userA socket to this room 



Joining Single Chat Rooms: ABA
1. on sign in, user socket joins own room (room + userId)
1. Friend clicks on user... client socket emit userId and friendId
2. Server: socket on catches ... adds friend socket to (room + userId)
  2a) (friendId + userId) create new room and add friend socket to this room
3. Server: socket emit to (room + userId) that friendId socket has joined the room
4. Client: socket on "create new one to one chat room" (friendId + userId) add user socket to this room 


create:
1. "join own room"
2. 


Big flaw in model....
by creating rooms, when 
         <chatRoom.to("room" + _friend._id).emit("friend join single chat",_friend._id,_user._id,_chat._id,_chat.messageStash)>

         it sends to even other people within it, other third party people. thus, model fails

         fixed by checking in the main.service.ts if the user id were the correct ones however, should not




Recreating Backend Model:
summary: we use rooms to make searching for users easier. otherwise, msgs are sent directly to sockets
question: if you log off the socket will it change the socket id? if not, then can send socket id with msg, if yes, send userid and search for socket id every time.  

Joining single chats:
comment code: gzo

for:

userA
userB

gzo1. on sign in, userA socket joins own room (room + userAId)
    location: server.js
gzo2a. userB clicks on userA... 
    location: user list component
gzo2b userB client socket emit userId and friendId (userA,userB id) to server
    location: main service
gzo3. Server: socket on catches ... adds userB socket to (room + userAId)
    location: server.js
gzo4. server sends chat info to userB
    location: server.js
gzo5. userB main service receives chat box opens for userB
    location:gzo5a) main service -->gzo5b) chat component


userB sends messages:
gzo6. userB sends a message
    location:gzo6a)chat component-->gzo6b) main service
gzo7. server: socket on catches --> 
    location: server.js
gzo8. server saves msg to database. 
    location: server.js

gzo9a.finds socket that matches userA socket id with userA id within (room + userAId)
gzo9b. server send msg to userA, userB socket directly
    location: server.js
gzo10. userA userB receives msg, client checks if the chat is already open. 
    location: main service 
gzo10a) if not, will send req for chat to server
    location: chat component
gzo10b) if yes, will add new msg to chat
    location: chat component


