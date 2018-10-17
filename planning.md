How to allow clicking a button display a component, multiple versions of the same component?


----------------------------------------------------------------
groups chats will be opened by clicking the button to that chat... the html will send a request to open the websocket and connect the user to that group... at that point like facebook, a new tab will open at the bottom.


Overall:
Main:
Join a group chat out of many others:
  -they are name spaces of socket io
  -can only join once your name is inputted
Group chat box pops up, filling chat with last 10 messages... if scroll up gives 10 more
  -need to set mongodb
  -on connect with socket will emit these 10 messages

Type within in to chat
  -messages contain time sent, content, creator
  -messages possibly contain which group chat


Extra Features:
-isTyping
-timeStamp
-1-1 chats
-user accounts
-user profiles
-posts
-tokens to enter group chats? group chat membership
-can only join a chat room once



1) Sign up/ login with username/password... creates a user in database



Will have multiple chat boxes that are displayed at the bottom...

Only connect to them through clicking

Login with username/password



Group Chat:
Login with username
  system will authorize with a token

Join a group chat with a password
  system will authorize with a token

Group chat box pops up
  you will join the socket
  
Type within in to chat




One to One Chat:
Login with username/password

Click on a person:

Opens up a personal chat pop up

When connecting, Will display previous chat messages up to 10

Type within to chat 

Messages are stored within the database and then are emitted to users if online



Routes:
Login/Sign up page
Group Chat page
User page

---user posts
