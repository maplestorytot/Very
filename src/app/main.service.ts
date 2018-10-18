import { Injectable } from "@angular/core";


import * as io from "socket.io-client";
import { ChatGroupType } from "./chatGroup.model";
import { MessageType } from "./message.model";
import { SignUpModel } from "./auth/auth.model";
import { HttpClient } from "../../node_modules/@angular/common/http";
import { Router } from "../../node_modules/@angular/router";
import { Subject } from "../../node_modules/rxjs";

// keep here because could make more than 1 service
@Injectable({
  providedIn: "root"
})
export class MainService  {
  private chatOneSocket=io.connect('http://localhost:3000/');


  // private authStatusListener = new Subject<boolean>();
  // getAuthStatusListener() {
  //   return this.authStatusListener.asObservable();
  // }

  constructor(private http: HttpClient, private router: Router) {}

  onLogin(username: string, password: string) {


      console.log(username + password)
      this.chatOneSocket.emit('authentication',{username:username,password:password});

    //   this.chatOneSocket.on('new user connected one',(myName:MessageType,groupNumber:number)=>{

    // });

    // this.chatOneSocket.emit('join room one',this.joinChatRoomOne.groupNumber);

    // this.chatOneSocket.emit("send chat message one", this.sendMessageOne.newMessage,this.sendMessageOne.groupNumber);

    //   //recieving messages
    // this.chatOneSocket.on("receive message one", (msg:MessageType,groupNumber:number)=> {
    //   this.receiveMessageOne(msg,groupNumber);
    // });


    // this.chatOneSocket.on("new user connected one", (myName:MessageType,groupNumber:number)=>{
    //   this.newUserJoinRoomOne(myName,groupNumber);
    // })
    }



  onCreateUser(
    firstName: string,
    lastName: string,
    nickName: string,
    username: string,
    password: string

  ) {
    const signUpUser:SignUpModel={
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

  //chat service.ts

    // creating a subscription for the messages
  // private socket = io("http://localhost:3000");
  private userId: string;
  private message:MessageType;

  private chatDisplay:ChatGroupType[] = [
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
  private numberOfGroupChatOpen= new Subject<any>();

  // constructor(private authService: AuthService) {}


  getNumberOfGroupChatOpen(){
    return this.numberOfGroupChatOpen.asObservable();
  }


  // could create another user model   passed back from data base that contain namme last name etc...
  getUserId() {
    return this.userId;
  }

  login(username:MessageType){
    this.userId=username.content;
    this.message=username;
  }

  joinChatRoomOne(groupNumber:number){
    // this changes the display information so that the chat room's joined value is true, allowing it be displayed
    this.chatDisplay[groupNumber].joined=true;

    // this emits a subject/data that is taken within chat component.ts, where it updates it there
    this.numberOfGroupChatOpen.next([...this.chatDisplay]);
    // the socket now calls the join room one function within server.js that allows you to join the room
    this.chatOneSocket.emit('join room one',this.message,groupNumber);
//
  }

  sendMessageOne(newMessage: MessageType,groupNumber:number) {
    this.chatOneSocket.emit("send chat message one", newMessage,groupNumber);
  }
  receiveMessageOne() {


    const messagesUpdated = new Subject<{message:MessageType,chatNumber:number}>();
    this.chatOneSocket.on("receive message one", (msg:MessageType,groupNumber:number)=> {

      messagesUpdated.next({message:msg,chatNumber:groupNumber});
    });
    return messagesUpdated.asObservable();
  }


  newUserJoinRoomOne(){

    const messagesUpdated = new Subject<{name:any,chatNumber:number}>();
    this.chatOneSocket.on("new user connected one", (myName:MessageType,groupNumber:number)=>{

      messagesUpdated.next({name:myName,chatNumber:groupNumber});
    })
    return messagesUpdated.asObservable();


}

}
