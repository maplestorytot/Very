import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Subject } from "../../node_modules/rxjs";
import { MessageType } from "./message.model";
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

  private chatDisplay:boolean[]=[false,false,false];
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

  joinChatRoomOne(){
    this.chatDisplay[0]=true;
    this.chatBox.next([...this.chatDisplay]);

    // ,{query:'name=this.userId'}
    // this.chatOneSocket = io.connect("http://localhost:3000/chatRoomOne?name="+this.getUserId());
    // this.chatOneSocket.on('connection',this.userId);
    // the client side client/socket will emit the event join room one passing the name as a parameter
    this.chatOneSocket.emit('join room one',this.message);

  }

  sendMessageOne(newMessage: MessageType) {
    this.chatOneSocket.emit("send chat message one", newMessage);
  }
  receiveMessageOne() {
    const messagesUpdated = new Subject<any>();
    this.chatOneSocket.on("receive message one", function(msg) {
      console.log(this.chatOneSocket);
      messagesUpdated.next(msg);
    });
    return messagesUpdated.asObservable();
  }


  newUserJoinRoomOne(){
    const messagesUpdated = new Subject<any>();
    this.chatOneSocket.on("new user connected one", (name:MessageType)=>{
      messagesUpdated.next(name);
    })
    return messagesUpdated.asObservable();

  }












 joinChatRoomTwo(){
    this.chatDisplay[1]=true;
    this.chatBox.next([...this.chatDisplay]);
    this.chatOneSocket.emit('join room two',this.message);

  }

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
