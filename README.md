# Veery
A chat app that makes use of socket.io for real time messaging. 
This project is comprised of MongoDB, Express.js, AngularJS, and Node.js (MEAN stack). 


## Development server
To run the app:

1) Clone the repo. 

2) git checkout workingVersion

3) Open a terminal and run `npm install`. This installs the dependencies for the project.

4) Open a terminal and run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

5) Open another terminal and run nodemon ./backend/server.js. 

6) Afterwards, you may create an account, login, and begin chatting with others users. You can do this by opening two tabs at `http://localhost:4200/`and login into two accounts. 

## Features
Finished:

-User Authentication using socket.io auth
-instant messaging in group chats using socket.io
-one to one chats

To do:
-implement file/image uploading
-improve front end aesthetics

Note: 
In the workingVersion branch, after sign up, you must refresh the page to login.

## Screenshots
![Frotn page](https://github.com/maplestorytot/Very/blob/master/Mobile Chatting.jpg?raw=true)
