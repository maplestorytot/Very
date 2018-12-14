import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "../../../node_modules/@angular/forms";
import { Subscription } from "../../../node_modules/rxjs";
import { MessageType } from "../message.model";
import { ChatGroupType } from "../chatGroup.model";
import { MainService } from "../main.service";
import { SingleChatType } from "../singleChat.model";
import { invalid } from "../../../node_modules/@angular/compiler/src/render3/view/util";
import { CreatorType } from "../creator.model";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit, OnDestroy {

  chatGroups: ChatGroupType[] = [
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

  singleChat:SingleChatType[]=[];


  // chatDisplay: boolean[] = [false, false, false];
  // currentMsgNotif: MessageType[] = [];

  putInUser = false;
  private messagesSub: Subscription;
  private messagesSingleSub:Subscription;

  private notificationSub: Subscription;
  private chatNumberSub: Subscription;
  private friendOpenChat:Subscription;
  private username: string;
  private currentUser:CreatorType;
  groupAuthenticated=false;
  // to know when to display chats if authenticated... used in the html
  userIsAuthenticated=false;
  private authListenerSubs:Subscription;
  // injecting the authentification service
  constructor(private mainService:MainService) {}
  // put the receive messages in here so that it doesn't create more than one instance of the messages
  ngOnInit() {
    this.messagesSub = this.mainService
      .receiveMessageOne()
      .subscribe(newMsg => {
        this.chatGroups[newMsg.chatNumber].messages.push(newMsg.message);
      });
    this.notificationSub = this.mainService
      .newUserJoinRoomOne()
      .subscribe(newNotif => {
        this.chatGroups[newNotif.chatNumber].messages.push(newNotif.name);
      });
      // this is updating the display connected to the component.html because there has been a change to the
      // chat boxes joined
    this.chatNumberSub = this.mainService.getNumberOfGroupChatOpen().subscribe(chatNumber => {
      this.chatGroups = chatNumber;
    });

    this.userIsAuthenticated = this.mainService.getIsAuth();
    this.authListenerSubs=this.mainService.getAuthenticatedListener().subscribe(isAuthenticated=>{
        this.currentUser=this.mainService.getCurrentUser();
        this.userIsAuthenticated=isAuthenticated;
        if(Boolean(isAuthenticated)===false){
           this.singleChat=[];

        }

    });

    this.messagesSingleSub=this.mainService.receiveMessageSingle().subscribe(messageInfo=>{
      console.log(messageInfo);

      const newMessage:MessageType={
        creator:{
          _id:messageInfo.message.creator._id,
          firstName:messageInfo.message.creator.firstName,
          lastName:messageInfo.message.creator.lastName,
          nickName:messageInfo.message.creator.nickName
        },
        content:messageInfo.message.content,
        time:messageInfo.message.time,
      };



      // // open chat box if not already opened
      var createChat=true;
      let i;
      console.log(this.singleChat.length);
      for (i=0;i<this.singleChat.length;i++) {
        if(messageInfo.chatId==this.singleChat[i].chatId){
          createChat=false;
          break;
        }else{

        }
      }
      // gzo10a) if not, will send req for chat to server
        if(createChat == true){
           //get messages, should create a new chat box
           //console.log(messageInfo.userId,this.currentUser._id)

          this.mainService.openSingleChat(messageInfo.friendId);
        }
        // gzo10b) if yes, will add new msg to chat
        else{

        this.singleChat[i].messages.push(newMessage);
        }

    });
  // gzo5b. userB main service receives chat box opens for userB
  this.friendOpenChat=this.mainService.openFriendChat().subscribe(chat=>{
      // get chatId, get chat top 10 messages
      let exist=false;
      let i=0;
      for (i=0;i<this.singleChat.length;i++) {
        if(chat.chatId==this.singleChat[i].chatId){
          exist=true;
          break;
        } else{
          exist=false;

        }

      }
      if(Boolean(exist)==true){

      } else{
        const newSingleChat:SingleChatType={
          chatId:chat.chatId,
          friendObj:chat.friendObj,
          userObj:chat.userObj,
          messages:chat.chatMessages
        }
        this.singleChat.push(newSingleChat);
      }
    });

    }


  //  gzo6a. userB sends a message
  onSendSingleMessage(form:NgForm,singleChat){
    if(form.invalid){
    return;
    }
    const newSingleMessage:MessageType={
        creator:this.currentUser,
        content:form.value.textIn,
        time:null
    }
    this.mainService.sendMessageSingle(singleChat.userObj._id,singleChat.friendObj._id,newSingleMessage,singleChat.chatId);
    form.setValue({textIn:""});
  }


  clearChats(index){
    this.singleChat.splice(index,1);
    console.log(this.singleChat.length)
  }














  onLoginUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.groupAuthenticated=true;
    this.username = form.value.username;
    this.putInUser = true;
    const notification: MessageType = {
      creator: null,
      content: this.username + " has joined the chat room!",
      time:null
    };
    this.mainService.login(notification);
  }

  onSendMessage(form: NgForm, group: number) {
    if (form.invalid) {
      return;
    }
    const creator:CreatorType={
      _id:this.currentUser._id,
      firstName:this.username,
      lastName:'',
      nickName:''
    };
    const message: MessageType = {
      content: form.value.typein,
      creator: creator,
      time:null
    };
      this.mainService.sendMessageOne(message,group);
      form.setValue({typein:""});
  }

  // onJoinGroupA(groupNumber:number){
  //   this.chatService.joinChatRoomOne(groupNumber);
  // }
  // onJoinGroupB(groupNumber:number){
  //   this.chatService.joinChatRoomOne(groupNumber);

  // }
  // onJoinGroupC(groupNumber:number){
  //   this.chatService.joinChatRoomOne(groupNumber);

  // }
  ngOnDestroy() {
    this.messagesSub.unsubscribe();
    this.notificationSub.unsubscribe();
    this.chatNumberSub.unsubscribe();
  }

}
