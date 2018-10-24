import { Injectable } from "@angular/core";


import * as io from "socket.io-client";
import { ChatGroupType } from "./chatGroup.model";
import { MessageType } from "./message.model";
import {  User } from "./auth/auth.model";
import { HttpClient } from "../../node_modules/@angular/common/http";
import { Router } from "../../node_modules/@angular/router";
import { Subject } from "../../node_modules/rxjs";

// keep here because could make more than 1 service
@Injectable({
  providedIn: "root"
})
export class MainService  {


  private chatOneSocket=io.connect('http://localhost:3000/');

  // if client is authenticated: to know if should display things
  private isAuthenticated=false;
  // used when opening chats will send the user id
  private userId: string;
  private allOfUsers:User[];
  // private authStatusListener = new Subject<boolean>();
  // getAuthStatusListener() {
  //   return this.authStatusListener.asObservable();
  // }

  constructor(private http: HttpClient, private router: Router) {}
  // the subject to send out the list of users to user list component
  private allOfTheUsersListener= new Subject<any>();
  private authenticatedListener= new Subject<any>();

  // the get for the list of user subject
  getAllOfTheUsersListener(){
    return this.allOfTheUsersListener.asObservable();
  }
  // if client is authenticated: to know if should display things
  getAuthenticatedListener(){
    return this.authenticatedListener.asObservable();
  }
  getIsAuth(){
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }
  // on login will take in the username and password
  onLogin(username: string, password: string) {
    this.router.navigate(["/group"]);

    // create a user to send to the database for verification
    const user:User={
      _id:null,
      firstName:null,
      lastName:null,
      nickName:null,
      username:username,
      password:password
    }
      // use socket io auth authentication method
      this.chatOneSocket.emit('authentication',user);
      // immediately afterwards, this get method for all the users
      this.chatOneSocket.on("get all users", (currentUser, allUsers: User[]) => {
        this.userId = currentUser._id;
        // list of user logic
       this.allOfUsers=allUsers;
       // emit all of the users using the subject listener
      this.allOfTheUsersListener.next([...this.allOfUsers]);


      //authenticated logic
      this.isAuthenticated=true;
      //notifying client that is autheticated
      this.authenticatedListener.next(this.isAuthenticated);
     })


    }



  onCreateUser(
    firstName: string,
    lastName: string,
    nickName: string,
    username: string,
    password: string

  ) {
    const signUpUser:User={
      _id:null,
      firstName: firstName,
    lastName: lastName,
    nickName: nickName,
    username: username,
    password: password

    }
    console.log(signUpUser);
    this.http.post("http://localhost:3000/api/user/signup",signUpUser).subscribe(()=>{
      this.router.navigate(["/"]);
    },error=>{
      // this.authStatusListener.next(false);
    })
  }

  openSingleChat(friendUserId) {
    this.chatOneSocket.emit("one to one chat", this.userId, friendUserId);


  }

  //receives server updates when joining users to next chat
  openFriendChat(){

    const openChatListener = new Subject<{ friendId:string,userId:string}>();

    this.chatOneSocket.on("friend join single chat",(_friendId:string,_userId:string)=>{
      console.log(_friendId+"joined")
      this.chatOneSocket.emit("friend join my chat",_friendId,_userId);
      openChatListener.next({friendId:_friendId, userId:_userId})
    });

    return openChatListener.asObservable();
  }



















  //GROUP CHAT LOGIC
  //chat service.ts

  // creating a subscription for the messages
  // private socket = io("http://localhost:3000");
  private _username: string;
  private message: MessageType;

  private chatDisplay: ChatGroupType[] = [
    {
      joined: false,
      messages: [],
      groupNumber: 0
    },
    {
      joined: false,
      messages: [],
      groupNumber: 1
    },
    {
      joined: false,
      messages: [],
      groupNumber: 2
    }
  ];
  private numberOfGroupChatOpen = new Subject<any>();

  // constructor(private authService: AuthService) {}

  getNumberOfGroupChatOpen() {
    return this.numberOfGroupChatOpen.asObservable();
  }

  // could create another user model   passed back from data base that contain namme last name etc...
  get_username() {
    return this._username;
  }

  login(username: MessageType) {
    this._username = username.content;
    this.message = username;
  }

  joinChatRoomOne(groupNumber: number) {
    // this changes the display information so that the chat room's joined value is true, allowing it be displayed
    this.chatDisplay[groupNumber].joined = true;

    // this emits a subject/data that is taken within chat component.ts, where it updates it there
    this.numberOfGroupChatOpen.next([...this.chatDisplay]);
    // the socket now calls the join room one function within server.js that allows you to join the room
    this.chatOneSocket.emit("join room one", this.message, groupNumber);
    //
  }

  sendMessageOne(newMessage: MessageType, groupNumber: number) {
    this.chatOneSocket.emit("send chat message one", newMessage, groupNumber);
  }
  receiveMessageOne() {
    const messagesUpdated = new Subject<{
      message: MessageType;
      chatNumber: number;
    }>();
    this.chatOneSocket.on(
      "receive message one",
      (msg: MessageType, groupNumber: number) => {
        messagesUpdated.next({ message: msg, chatNumber: groupNumber });
      }
    );
    return messagesUpdated.asObservable();
  }

  newUserJoinRoomOne() {
    const messagesUpdated = new Subject<{ name: any; chatNumber: number }>();
    this.chatOneSocket.on(
      "new user connected one",
      (myName: MessageType, groupNumber: number) => {
        console.log(myName.content + groupNumber)
        messagesUpdated.next({ name: myName, chatNumber: groupNumber });
      }
    );
    return messagesUpdated.asObservable();
  }
}
