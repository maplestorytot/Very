import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChatService } from "../chat.service";
import { NgForm } from "../../../node_modules/@angular/forms";
import { Subscription } from "../../../node_modules/rxjs";
import { MessageType } from "../message.model";
@Component({
  selector:"app-chat",
  templateUrl: "./chat.component.html",
  styleUrls:['./chat.component.css']
})
export class ChatComponent implements OnInit,OnDestroy {
  putInUser=false;
  private messagesSub:Subscription;
  private notificationSub:Subscription;
  private chatNumberSub:Subscription;
  private username:string;
   chatDisplay:boolean[]=[false,false,false];
  // an array of either messages or notifications
  currentMsgNotif:MessageType[]=[];


  //currentMessages:MessageType[]=[];
  // injecting the authentification service
  constructor(private chatService: ChatService) {}
  // put the receive messages in here so that it doesn't create more than one instance of the messages
  ngOnInit(){
    this.messagesSub=this.chatService.receiveMessage().subscribe(newMessage=>{

      this.currentMsgNotif.push(newMessage);
    })
    this.notificationSub=this.chatService.newUserJoinRoomOne().subscribe(newNotification=>{
      console.log(newNotification);
      this.currentMsgNotif.push(newNotification);
    })
    this.chatNumberSub=this.chatService.getChatBox().subscribe(chatNumber=>{
      this.chatDisplay=chatNumber;
    })
  }
  onLoginUser(form:NgForm){
    if (form.invalid) {
      return;
    }
    this.username=form.value.username;
    this.putInUser=true;
    const notification:MessageType={
      creator:null,
      content:this.username + " has joined the chat room!"
    }
    this.chatService.login(notification);
  }

  onSendMessage(form: NgForm){
    if (form.invalid) {
      return;
    }
    const message:MessageType={
      content:form.value.typein,
      creator:this.username
    };

    this.chatService.sendMessage(message);

  }
  ngOnDestroy(){
    this.messagesSub.unsubscribe();
    this.notificationSub.unsubscribe();
    this.chatNumberSub.unsubscribe();
  }
}
