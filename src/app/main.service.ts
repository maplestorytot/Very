import { Injectable } from "@angular/core";

import * as io from "socket.io-client";
import { ChatGroupType } from "./chatGroup.model";
import { MessageType } from "./message.model";
import { User } from "./auth/auth.model";
import { HttpClient } from "../../node_modules/@angular/common/http";
import { Router } from "../../node_modules/@angular/router";
import { Subject } from "../../node_modules/rxjs";
import { Message } from "../../node_modules/@angular/compiler/src/i18n/i18n_ast";
import { CreatorType } from "./creator.model";
import{environment} from "../environments/environment"
import { ResponsiveService } from "./responsive.service";
import { SingleChatType } from "./singleChat.model";

const BACKEND_URL=environment.serverUrl;
// keep here because could make more than 1 service
@Injectable({
  providedIn: "root"
})
export class MainService{
  private backgroundIMGURL:string;
  private currentUser: CreatorType;
  private tokenTimer:any;
  private chatOneSocket = io.connect(BACKEND_URL);
  // if client is authenticated: to know if should display things
  private isAuthenticated = false;
  // used when opening chats will send the user id
  private userId: string;
  private allOfUsers: User[];
  private singleChat:SingleChatType[]=[];
  // used when clearing currently opened chats
  private singleOpenedChatListener=new Subject<any>();
  // private authStatusListener = new Subject<boolean>();
  // getAuthStatusListener() {
  //   return this.authStatusListener.asObservable();
  // }

  constructor(private http: HttpClient, private router: Router, private responsiveService:ResponsiveService) {}
  // the subject to send out the list of users to user list component
  private allOfTheUsersListener = new Subject<any>();
  private authenticatedListener = new Subject<any>();
  private currentUserListener = new Subject<any>();
  private backgroundURLListener=new Subject<string>();
  getCurrentUserListener() {
    return this.currentUserListener.asObservable();
  }
  // the get for the list of user subject
  getAllOfTheUsersListener() {
    return this.allOfTheUsersListener.asObservable();
  }
  getBackGroundPicListener(){
    return this.backgroundURLListener.asObservable();
  }
  // if client is authenticated: to know if should display things
  getAuthenticatedListener() {
    return this.authenticatedListener.asObservable();
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }
  getCurrentUser() {
    return this.currentUser;
  }

  // on login will take in the username and password
  onLogin(username: string, password: string) {
    this.router.navigate(["/"]);
    if(this.responsiveService.getIsMobile){
      this.responsiveService.onChangeState("userList");
    }
    // create a user to send to the database for verification
    const user: User = {
      _id: null,
      firstName: null,
      lastName: null,
      nickName: null,
      username: username,
      password: password
    };

    // use socket io auth authentication method
    this.chatOneSocket.emit("authentication", user);
    this.chatOneSocket.on('get back img',(imgdata)=>{
      this.backgroundIMGURL=imgdata.hdurl;
      this.backgroundURLListener.next(this.backgroundIMGURL);
      console.log(imgdata)
    });
    // immediately afterwards, this get method for all the users
    this.chatOneSocket.on("get all users", (currentUser, allUsers: User[]) => {

      // ayth2b) only continue authenticated user/send users data if token exists
        this.currentUser = currentUser;
        this.currentUserListener.next(currentUser);
        this.userId = currentUser._id;
        // ayth3) client stores token in local storage. sets a timer function
        // when get token, get the expire duration
        const expiresInDuration = 3600;
        // log out when timeout occurs milliseconds, save it to be in
        this.setAuthTimer(expiresInDuration);

        // making a new date by adding the expires in time with the current time and then saving that data through method.
        const now = new Date();
        const expirationDate = new Date(
          now.getTime() + expiresInDuration * 1000
        );
        //this.saveAuthData(this.token, expirationDate, this.userId);



        // list of user logic
        this.allOfUsers = allUsers;
        // emit all of the users using the subject listener
        this.allOfTheUsersListener.next([...this.allOfUsers]);

        // authenticated logic
        this.isAuthenticated = true;
        // notifying client that is autheticated
        this.authenticatedListener.next(this.isAuthenticated);


    });
  }
  // ayth3c) logout function clear everything

  logout() {
    this.userId=null;
    this.isAuthenticated = false;
    // make sure not autheticated any more and clear out everything
    clearTimeout(this.tokenTimer);
    this.currentUser = null;
    this.allOfUsers=null;
    // this.clearAuthData();
    // navigate back to hme back
    this.authenticatedListener.next(false);
    this.allOfTheUsersListener.next(this.allOfUsers)
    this.router.navigate(["/"]);
    //this.chatOneSocket.disconnect();
  }

  // local storage, storing token in case of refreshing page
 /* private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }
*/
 /* // auth3d) clear local storage function
  private clearAuthData() {
    // removing data from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }
  */
  //this is a private method to return the data if need to relog the user
  //ayth3b) timer function that calls logout, asynchronous that will call after the duration time
  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }




  onCreateUser(
    firstName: string,
    lastName: string,
    nickName: string,
    username: string,
    password: string
  ) {
    const signUpUser: User = {
      _id: null,
      firstName: firstName,
      lastName: lastName,
      nickName: nickName,
      username: username,
      password: password
    };
    console.log(signUpUser);
    this.http
      .post(BACKEND_URL+"api/user/signup", signUpUser)
      .subscribe(
        () => {
          this.router.navigate(["/"]);
          if(this.responsiveService.getIsMobile){
            this.responsiveService.onChangeState("other");
          }
        },
        error => {
          // this.authStatusListener.next(false);
        }
      );
  }

  //gzo2b userB client socket emit userId and friendId (userA,userB id) to server
  openSingleChat(friendUserId) {
    this.chatOneSocket.emit("one to one chat", this.userId, friendUserId);
  }

  // gzo5a. userB main service receives chat box opens for userB
  openFriendChat() {
    const openChatListener = new Subject<{
      friendObj: CreatorType;
      userObj: CreatorType;
      chatId: string;
      chatMessages: MessageType[];
    }>();
    this.chatOneSocket.on(
      "friend join single chat",
      (
        _friendObj: CreatorType,
        _userObj: CreatorType,
        _chatId: string,
        _chatMessages: MessageType[]
      ) => {
        console.log(_friendObj);
        openChatListener.next({
          friendObj: _friendObj,
          userObj: _userObj,
          chatId: _chatId,
          chatMessages: _chatMessages
        });
      }
    );
    return openChatListener.asObservable();
  }

  // gzo6b. userB sends a message
  sendMessageSingle(
    userId: string,
    friendId: string,
    newMessage: MessageType,
    chatId: string
  ) {
    this.chatOneSocket.emit(
      "send single message to room",
      userId,
      friendId,
      newMessage,
      chatId
    );
  }

  // gzo10. userA userB receives msg, client checks if the chat is already open.
  receiveMessageSingle() {
    const singleMessagesUpdated = new Subject<{
      message: MessageType;
      chatId: string;
      userId: string;
      friendId: string;
    }>();
    this.chatOneSocket.on(
      "single chat send message",
      (
        _userId: string,
        _friendId: string,
        chatId: string,
        msg: MessageType

      ) => {
        singleMessagesUpdated.next({
          message: msg,
          chatId: chatId,
          userId: _userId,
          friendId: _friendId
        });
      }
    );
    return singleMessagesUpdated.asObservable();
  }



  // psts2. search in main service for userId348043: returns it profile component to display done within ngoninit

  getSpecificUser(userId:string){
    for(let i=0;i<this.allOfUsers.length;i++){
      if(this.allOfUsers[i]._id===userId){
        return this.allOfUsers[i];
      }
    }
  }

  getAllOpenedChats(){
    return this.singleOpenedChatListener.asObservable();
  }
  deleteAllChats(){
    this.singleOpenedChatListener.next([]);
  }









  // GROUP CHAT LOGIC
  // chat service.ts

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
        console.log(myName.content + groupNumber);
        messagesUpdated.next({ name: myName, chatNumber: groupNumber });
      }
    );
    return messagesUpdated.asObservable();
  }
}
