import { Injectable } from "@angular/core";

import * as io from "socket.io-client";
import { MessageType } from "./models/message.model";
import { HttpClient } from "../../node_modules/@angular/common/http";
import { Router } from "../../node_modules/@angular/router";
import { Subject } from "../../node_modules/rxjs";
// import { Message } from "../../node_modules/@angular/compiler/src/i18n/i18n_ast";
import { UserType } from "./models/user.model";
import{environment} from "../environments/environment"
import { ResponsiveService } from "./responsive.service";
import { ChatType } from "./models/chat.model";

const BACKEND_URL=environment.serverUrl;
// keep here because could make more than 1 service
@Injectable({
  providedIn: "root"
})
export class MainService{
  // private backgroundIMGURL:string;
  private tokenTimer:any;
  private token;
  private socket = io.connect(BACKEND_URL, {
    query: {token: this.token}
  });
  // if client is authenticated: to know if should display things
  private isAuthenticated = false;
  // used when opening chats will send the user id
  private currentUser;
  private userId: string;
  private allOfUsers=[];
  private friends=[];
  private chats:ChatType[]=[];
  private requests=[];
  

  constructor(private http: HttpClient, private router: Router, private responsiveService:ResponsiveService) {
    // this.autoAuthUser();
  }
  // used when clearing currently opened chats
  private openedChatsListener=new Subject<any>();
  // private authStatusListener = new Subject<boolean>();
  // getAuthStatusListener() {
  //   return this.authStatusListener.asObservable();
  // }
  // the subject to send out the list of users to user list component
  private friendsListener= new Subject<any>();
  private allOfTheUsersListener = new Subject<any>();
  private authenticatedListener = new Subject<any>();
  private currentUserListener = new Subject<any>();
  private requestsListener= new Subject<any>();
  // private backgroundURLListener=new Subject<string>();
  // private socketListener=new Subject<any>();
  // getSocketListener(){
  //   return this.socketListener.asObservable();    
  // }
  getCurrentUserListener() {
    return this.currentUserListener.asObservable();
  }
  getFriendsListener(){
    return this.friendsListener.asObservable();
  }
  // the get for the list of user subject
  getAllOfTheUsersListener() {
    return this.allOfTheUsersListener.asObservable();
  }
  getRequestsListener() {
    return this.requestsListener.asObservable();
  }
  // getBackGroundPicListener(){
  //   return this.backgroundURLListener.asObservable();
  // }
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
  getAllUser(){
    return this.allOfUsers;
  }
  getRequests(){
    return this.requests;
  }
  getCurrentUser() {
    return this.currentUser;
  }
  getAllOpenedChats(){
    return this.openedChatsListener.asObservable();
  }
  // on login will take in the username and password
  onLogin(username: string, password: string) {
    this.router.navigate(["/"]);
    if(this.responsiveService.getIsMobile){
      this.responsiveService.onChangeState("userList");
    }
    // create a user to send to the database for verification
    const loginCredentials = {
      username: username,
      password: password
    };

    // use socket io auth authentication method
    this.socket.emit("authentication", loginCredentials,(token,authenticated,currentUser)=>{
      if(!authenticated){
        console.log("not authenticated")
      }else if(authenticated && token){
        this.currentUser = currentUser;
        console.log(this.currentUser);
        console.log(this.currentUserListener);
        this.currentUserListener.next(this.currentUser);
        this.userId = currentUser._id;
        console.log("Authenticated")  
        // authenticated logic
        this.isAuthenticated = true;
        this.requests=currentUser.friendRequests;
        // notifying client that is autheticated
        this.authenticatedListener.next(this.isAuthenticated);
        // this.socketListener.next(this.socket);
      }
    });
    // image 
    //this.socket.on('get back img',(imgdata)=>{
    //   this.backgroundIMGURL=imgdata.hdurl;
    //   this.backgroundURLListener.next(this.backgroundIMGURL);
    //   console.log(imgdata)
    // });
    // immediately afterwards, this get method for all the users
    this.socket.on("get all users", ( allUsers) => {

      // ayth2b) only continue authenticated user/send users data if token exists

        // ayth3) client stores token in local storage. sets a timer function
        // when get token, get the expire duration
        const expiresInDuration = 3600;
        // log out when timeout occurs milliseconds, save it to be in
        // this.setAuthTimer(expiresInDuration);

        // making a new date by adding the expires in time with the current time and then saving that data through method.
        const now = new Date();
        const expirationDate = new Date(
          now.getTime() + expiresInDuration * 1000
        );
        // this.saveAuthData(token, expirationDate, this.userId);



        // list of user logic
        this.allOfUsers = allUsers;
        console.log(allUsers);
        // emit all of the users using the subject listener
        this.allOfTheUsersListener.next(allUsers);

  

    });
    this.socket.on("get friends", ( friends: UserType[]) => {
      this.friends=friends;
      this.friendsListener.next(friends);
      
    });
    this.socket.on("receive friend request", (request)=>{
      if(request){
        this.requests.push(request);
      }
    })
    //user send friend a request, request stored on friend
    this.socket.on("someone accepted friend request",(updatedFriendsList)=>{
      console.log('someone accept friend request', updatedFriendsList);
      if(updatedFriendsList){
        this.friends= updatedFriendsList
        // this.requests= updatedUser.friendRequests;
        this.friendsListener.next(this.friends);
      }
    })
  }
  // ayth3c) logout function clear everything

  logout() {
    this.userId=null;
    this.isAuthenticated = false;
    // make sure not autheticated any more and clear out everything
    // clearTimeout(this.tokenTimer);
    this.currentUser = null;
    this.allOfUsers=null;
    // this.clearAuthData();
    // navigate back to hme back
    this.authenticatedListener.next(false);
    this.allOfTheUsersListener.next(this.allOfUsers)
    this.router.navigate(["/"]);
    // this.clearAuthData();
    //this.socket.disconnect();
  }

  // local storage, storing token in case of refreshing page
  // private saveAuthData(token: string, expirationDate: Date, userId: string) {
  // console.log(token)
  //   localStorage.setItem("userId", userId);
  //   localStorage.setItem("token", token);
  //   localStorage.setItem("expiration", expirationDate.toISOString());
  // }
 // auth3d) clear local storage function
  // private clearAuthData() {
  //   // removing data from local storage
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("expiration");
  //   localStorage.removeItem("userId");
  // }
  
  //this is a private method to return the data if need to relog the user
  //ayth3b) timer function that calls logout, asynchronous that will call after the duration time
  // private setAuthTimer(duration: number) {
  //   console.log("Setting timer: " + duration);
  //   this.tokenTimer = setTimeout(() => {
  //     this.logout();
  //   }, duration * 1000);
  // }
  // private autoAuthUser() {
  //   const authInformation = this.getAuthData();
  //   if (!authInformation) {
  //     return;
  //   }
  //   const now = new Date();
  //   const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
  //   if (expiresIn > 0) {
  //     this.userId = authInformation.userId;
  //     this.token = authInformation.token;
  //     this.isAuthenticated = true;
  //     this.setAuthTimer(expiresIn / 1000);
  //     this.authenticatedListener.next(true);
      
  //     this.socket.emit("tokenAuthentication",this.token,function(authenticated){
  //       if(!authenticated){
  //         this.router.navigate(["/"]);
  //         console.log("Not authenticated")
  //       }else if(authenticated){
  //         console.log("Authenticated")  
  //       }
  //     });

  //         // immediately afterwards, this get method for all the users
  //   this.socket.on("get all users", (token,currentUser, allUsers: User[]) => {
  //     console.log(token)

  //     // ayth2b) only continue authenticated user/send users data if token exists
  //       this.currentUser = currentUser;
  //       this.currentUserListener.next(currentUser);
  //       this.userId = currentUser._id;
  //       // ayth3) client stores token in local storage. sets a timer function
  //       // when get token, get the expire duration
  //       const expiresInDuration = 3600;
  //       // log out when timeout occurs milliseconds, save it to be in
  //       this.setAuthTimer(expiresInDuration);

  //       // making a new date by adding the expires in time with the current time and then saving that data through method.
  //       const now = new Date();
  //       const expirationDate = new Date(
  //         now.getTime() + expiresInDuration * 1000
  //       );
  //       // this.saveAuthData(token, expirationDate, this.userId);



  //       // list of user logic
  //       this.allOfUsers = allUsers;
  //       // emit all of the users using the subject listener
  //       this.allOfTheUsersListener.next([...this.allOfUsers]);

  //       // authenticated logic
  //       this.isAuthenticated = true;
  //       // notifying client that is autheticated
  //       this.authenticatedListener.next(this.isAuthenticated);
  //       this.socketListener.next(this.socket);

  //   });
  //   }
  // }
  // private getAuthData() {
  //   const token = localStorage.getItem("token");
  //   const expirationDate = localStorage.getItem("expiration");
  //   // if token and exp date exist create an object to return them autoAuthUser
  //   const userId = localStorage.getItem("userId");
  //   if (!token || !expirationDate) {
  //     return;
  //   }
  //   return {
  //     token: token,
  //     expirationDate: new Date(expirationDate),
  //     userId: userId
  //   };
  // }


  addFriend(friendId){
    this.socket.emit('send friend request',friendId,function(res){
      console.log(res)
    })
  }
  onCreateUser(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    hobbies:string[],
    age:Number,
    birthday:string,
    country:string,
    knownLanguages:{
      name:string,
      profiency:string
    }[],
    learningLanguages:{
      name:string,
      profiency:string
    }[]
  ) {
    const signUpUser: UserType = {
      _id: null,
      firstName: firstName,
      lastName: lastName,
      friendRequests:null,
      friends:null,
      chatOpened:null,
      username: username,
      password: password,
      hobbies:hobbies||[],
      age:age||-1,
      birthday:birthday||'',
      country:country||'',
      knownLanguages:knownLanguages||[],
      learningLanguages:learningLanguages||[]

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
    console.log(this.userId, friendUserId);
    this.socket.emit("get chat", this.userId, friendUserId,(chat)=>{
      console.log(chat);
      this.chats.push(chat);
      this.openedChatsListener.next(this.chats);
    });
  }

  // sentRequest(requestId){
  //   this.socket.emit("send friend request", requestId, (msg)=>{
  //     console.log(msg);
  //   })
  // }
  // receiveRequest(request){

  // }
  acceptRequest(requestId){

    this.socket.emit('accept friend request',requestId,(updatedFriendList,updatedRequestList)=>{
      console.log('hi')
        console.log(updatedFriendList,updatedRequestList)
        console.log(this.requests)
        this.requests.forEach((request,index) => {
          if(request._id==requestId){
            this.requests.splice(index,1);
          }
        })
        // Update the friends list
        this.friends = updatedFriendList;
        // this.user = updatedUser;
        // this.requests= updatedRequestList;
        console.log(this.friends)
        this.friendsListener.next(updatedFriendList);

    })
  }
  denyRequest(requestId){
    
    this.socket.emit('delete friend request',requestId,(done)=>{
      // Update the friends list
      if(done){
        this.requests.forEach((request,index) => {
          if(request._id==requestId){
            this.requests.splice(index,1);
          }
        });
      }else{
        console.log('unable to delete friend request')
      }
    })
  }
  // gzo5a. userB main service receives chat box opens for userB
  // openFriendChat() {
  //   const openChatListener = new Subject<{
  //     friendObj: UserType;
  //     userObj: UserType;
  //     chatId: string;
  //     chatMessages: MessageType[];
  //   }>();
  //   this.socket.on(
  //     "friend join single chat",
  //     (
  //       _friendObj: UserType,
  //       _userObj: UserType,
  //       _chatId: string,
  //       _chatMessages: MessageType[]
  //     ) => {
  //       console.log(_friendObj);
  //       openChatListener.next({
  //         friendObj: _friendObj,
  //         userObj: _userObj,
  //         chatId: _chatId,
  //         chatMessages: _chatMessages
  //       });
  //     }
  //   );
  //   return openChatListener.asObservable();
  // }

  // gzo6b. userB sends a message
  sendMessageSingle(
    newMessage: MessageType,
    chatId: string
  ) {
    console.log(this.socket)

    this.socket.emit(
      "send single message to chat",
      newMessage,
      chatId,(res)=>{
        console.log(res);
      }
    );
  }

  // gzo10. userA userB receives msg, client checks if the chat is already open.
  receiveMessageSingle() {
    const singleMessagesUpdated = new Subject<{
      message: MessageType;
      chatId: string;
      users;
    }>();
    this.socket.on(
      "receive single message to chat",
      (

        msg: MessageType,
        chatId:string,
        users
      ) => {
        singleMessagesUpdated.next({
          message: msg,
          chatId: chatId,
          users:users

        });
      }
    );
    return singleMessagesUpdated.asObservable();
  }



  // psts2. search in main service for userId348043: returns it profile component to display done within ngoninit
  //FUNCTIONS
  getSpecificUser(userId:string){
    for(let i=0;i<this.allOfUsers.length;i++){
      if(this.allOfUsers[i]._id===userId){
        return this.allOfUsers[i];
      }
    }
  }


  deleteAllChats(){
    this.openedChatsListener.next([]);
  }









  // GROUP CHAT LOGIC
  // chat service.ts

  // creating a subscription for the messages
  // private socket = io("http://localhost:3000");
  // private _username: string;
  // private message: MessageType;

  // private chatDisplay: ChatGroupType[] = [
  //   {
  //     joined: false,
  //     messages: [],
  //     groupNumber: 0
  //   },
  //   {
  //     joined: false,
  //     messages: [],
  //     groupNumber: 1
  //   },
  //   {
  //     joined: false,
  //     messages: [],
  //     groupNumber: 2
  //   }
  // ];
  // private numberOfGroupChatOpen = new Subject<any>();

  // // constructor(private authService: AuthService) {}

  // getNumberOfGroupChatOpen() {
  //   return this.numberOfGroupChatOpen.asObservable();
  // }

  // // could create another user model   passed back from data base that contain namme last name etc...
  // get_username() {
  //   return this._username;
  // }

  // login(username: MessageType) {
  //   this._username = username.content;
  //   this.message = username;
  // }

  // joinChatRoomOne(groupNumber: number) {
  //   // this changes the display information so that the chat room's joined value is true, allowing it be displayed
  //   this.chatDisplay[groupNumber].joined = true;

  //   // this emits a subject/data that is taken within chat component.ts, where it updates it there
  //   this.numberOfGroupChatOpen.next([...this.chatDisplay]);
  //   // the socket now calls the join room one function within server.js that allows you to join the room
  //   this.socket.emit("join room one", this.message, groupNumber);
  //   //
  // }

  // sendMessageOne(newMessage: MessageType, groupNumber: number) {
  //   this.socket.emit("send chat message one", newMessage, groupNumber);
  // }
  // receiveMessageOne() {
  //   const messagesUpdated = new Subject<{
  //     message: MessageType;
  //     chatNumber: number;
  //   }>();
  //   this.socket.on(
  //     "receive message one",
  //     (msg: MessageType, groupNumber: number) => {
  //       messagesUpdated.next({ message: msg, chatNumber: groupNumber });
  //     }
  //   );
  //   return messagesUpdated.asObservable();
  // }

  // newUserJoinRoomOne() {
  //   const messagesUpdated = new Subject<{ name: any; chatNumber: number }>();
  //   this.socket.on(
  //     "new user connected one",
  //     (myName: MessageType, groupNumber: number) => {
  //       // console.log(myName.content + groupNumber);
  //       messagesUpdated.next({ name: myName, chatNumber: groupNumber });
  //     }
  //   );
  //   return messagesUpdated.asObservable();
  // }
}
