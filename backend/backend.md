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
