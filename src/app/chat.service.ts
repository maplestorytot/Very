import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Subject } from "../../node_modules/rxjs";
import { MessageType } from "./message.model";
import { ChatGroupType } from "./chatGroup.model";
// keep here because could make more than 1 service
@Injectable({
  providedIn: "root"
})
export class ChatService  {

  // connecitng to the name space
  private chatOneSocket=io.connect('http://localhost:3000/chatRoom');

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
  private chatBox= new Subject<any>();
  getChatBox(){
    return this.chatBox.asObservable();
  }
  // could create another user model   passed back from data base that contain namme last name etc...
  getUserId() {
    return this.userId;
  }

  login(username:MessageType){
    this.userId=username.content;
    this.message=username;
    // console.log(this.userId);
  }

  joinChatRoomOne(groupNumber:number){
    this.chatDisplay[groupNumber].joined=true;
    this.chatBox.next([...this.chatDisplay]);

    // ,{query:'name=this.userId'}
    // this.chatOneSocket = io.connect("http://localhost:3000/chatRoomOne?name="+this.getUserId());
    // this.chatOneSocket.on('connection',this.userId);
    // the client side client/socket will emit the event join room one passing the name as a parameter
    this.chatOneSocket.emit('join room one',this.message,groupNumber);

  }

  sendMessageOne(newMessage: MessageType,groupNumber:number) {

    this.chatOneSocket.emit("send chat message one", newMessage,groupNumber);
  }
  receiveMessageOne() {
    const messagesUpdated = new Subject<{message:any,chatNumber:number}>();
    this.chatOneSocket.on("receive message one", (msg:MessageType,groupNumber:number)=> {
      console.log(this.chatOneSocket);
      messagesUpdated.next({message:msg,chatNumber:groupNumber});
    });
    return messagesUpdated.asObservable();
  }


  newUserJoinRoomOne(){
    const messagesUpdated = new Subject<{name:any,chatNumber:number}>();
    this.chatOneSocket.on("new user connected one", (myName:MessageType,groupNumber:number)=>{
      console.log(myName);
      console.log(groupNumber);
      messagesUpdated.next({name:myName,chatNumber:groupNumber});
    })
    return messagesUpdated.asObservable();

  }












//  joinChatRoomTwo(){
//     this.chatDisplay[1]=true;
//     this.chatBox.next([...this.chatDisplay]);
//     this.chatOneSocket.emit('join room two',this.message);

//   }

  sendMessageTwo(newMessage: MessageType) {
    this.chatOneSocket.emit("send chat message two", newMessage);
  }
  receiveMessageTwo() {
    const messagesUpdated = new Subject<any>();
    this.chatOneSocket.on("receive message two", function(msg) {
      console.log(this.chatOneSocket);
      messagesUpdated.next(msg);
    });
    return messagesUpdated.asObservable();
  }


  newUserJoinRoomTwo(){
    const messagesUpdated = new Subject<any>();
    this.chatOneSocket.on("new user connected two", (name:MessageType)=>{
      messagesUpdated.next(name);
    })
    return messagesUpdated.asObservable();

  }





}
