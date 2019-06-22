import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { MessageType } from "../models/message.model";
import { MainService } from "../main.service";
import { ChatType } from "../models/chat.model";
import { invalid } from "@angular/compiler/src/render3/view/util";
import { UserType } from "../models/user.model";
import { ResponsiveService } from "../responsive.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit, OnDestroy {

  /* chatGroups: ChatType[] = [
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
 */
  chats=[];


  // chatDisplay: boolean[] = [false, false, false];
  // currentMsgNotif: MessageType[] = [];

  putInUser = false;
  isMobile:boolean;
  private messagesSub: Subscription;
  private messagesSingleSub:Subscription;
  // private changeOpenedChatsSub:Subscription;
  private notificationSub: Subscription;
  private chatNumberSub: Subscription;
  private friendOpenChat:Subscription;
  private resizeSub:Subscription;
  private username: string;
  private chatsSub:Subscription;
  private currentUser:UserType;
  groupAuthenticated=false;
  // to know when to display chats if authenticated... used in the html
  userIsAuthenticated=false;
  private authListenerSubs:Subscription;
  // injecting the authentification service
  constructor(private mainService:MainService, private responsiveService:ResponsiveService, private router:Router) {}
  // put the receive messages in here so that it doesn't create more than one instance of the messages
  ngOnInit() {
    this.chatsSub= this.mainService.getAllOpenedChats().subscribe(chats=>{
      console.log(chats);
      this.chats = chats;
    })
    // this.messagesSub = this.mainService
    //   .receiveMessageOne()
    //   .subscribe(newMsg => {
    //     this.chatGroups[newMsg.chatNumber].messages.push(newMsg.message);
    //   });
    // this.notificationSub = this.mainService
    //   .newUserJoinRoomOne()
    //   .subscribe(newNotif => {
    //     this.chatGroups[newNotif.chatNumber].messages.push(newNotif.name);
    //   });
      // this is updating the display connected to the component.html because there has been a change to the
      // chat boxes joined
    // this.chatNumberSub = this.mainService.getNumberOfGroupChatOpen().subscribe(chatNumber => {
    //   this.chatGroups = chatNumber;
    // });

    this.userIsAuthenticated = this.mainService.getIsAuth();
    this.authListenerSubs=this.mainService.getAuthenticatedListener().subscribe(isAuthenticated=>{
        this.currentUser=this.mainService.getCurrentUser();
        this.userIsAuthenticated=isAuthenticated;
        if(Boolean(isAuthenticated)===false){
           this.chats=[];

        }

    });

    this.messagesSingleSub=this.mainService.receiveMessageSingle().subscribe(messageInfo=>{
      console.log(messageInfo);

      const newMessage:MessageType={
        creator:{
          _id:messageInfo.message.creator._id,
          firstName:messageInfo.message.creator.firstName,
          lastName:messageInfo.message.creator.lastName        },
        content:messageInfo.message.content,
        datetime:messageInfo.message.datetime,
      };



      // // open chat box if not already opened
      var createChat=true;
      let i;
      console.log(this.chats.length);
      for (i=0;i<this.chats.length;i++) {
        if(messageInfo.chatId==this.chats[i]._id){
          createChat=false;
          break;
        }else{

        }
      }
      // gzo10a) if not, will send req for chat to server
        if(createChat == true){
           //get messages, should create a new chat box
           //console.log(messageInfo.userId,this.currentUser._id)

          // this.mainService.openSingleChat(messageInfo.friendId);
        }
        // gzo10b) if yes, will add new msg to chat
        else{
          console.log(this.chats,'hiii')
        this.chats[i].messageStash.push(newMessage);
        }

    });
  // gzo5b. userB main service receives chat box opens for userB
  // this.friendOpenChat=this.mainService.openFriendChat().subscribe(chat=>{
  //     // get chatId, get chat top 10 messages
  //     let exist=false;
  //     let i=0;
  //     for (i=0;i<this.chats.length;i++) {
  //       if(chat.chatId==this.chats[i].chatId){
  //         exist=true;
  //         break;
  //       } else{
  //         exist=false;

  //       }

  //     }
  //     if(Boolean(exist)==true){

  //     } else{
  //       const newSingleChat:ChatType={
  //         chatId:chat.chatId,
  //         users:[chat.friendObj,chat.userObj],
  //         messages:chat.chatMessages
  //       }
  //       this.chats.push(newSingleChat);
  //     }
  //   });

    // when resizing to mobile view, delete all chats to restart.
    this.resizeSub=this.responsiveService.getIsMobile().subscribe(_isMobile=>{
      this.isMobile=_isMobile;
      if(_isMobile){
        this.chats=[];
      }
    });

    // used to change open chats list, usually for deleting all opened chats
    // this.changeOpenedChatsSub=this.mainService.getAllOpenedChats().subscribe(_openedChats=>{
    //   if(_openedChats){
    //     this.chats=_openedChats;
    //   }
    // });

    // when created check if mobile
    this.responsiveService.checkMobile();
}


  //  gzo6a. userB sends a message
  onSendSingleMessage(form:NgForm,chats){
    if(form.invalid){
    return;
    }
    const newSingleMessage:MessageType={
        creator:this.currentUser,
        content:form.value.textIn,
        datetime:Date.now()
    }
    this.mainService.sendMessageSingle(/* chats.userObj._id,chats.friendObj._id, */newSingleMessage,chats._id);
    form.setValue({textIn:""});
  }


  clearChats(chatToDelete){
    console.log(chatToDelete);
    var i=0;
    for( i;i<this.chats.length;i++){
      if(this.chats[i]===chatToDelete){
     this.chats.splice(i,1);
      }
    }
    this.router.navigate(["/"]);
    if(this.responsiveService.getCheckIsMobile()){
      this.responsiveService.onChangeState("userList");
    }
  }














  // onLoginUser(form: NgForm) {
  //   if (form.invalid) {
  //     return;
  //   }
  //   this.groupAuthenticated=true;
  //   this.username = form.value.username;
  //   this.putInUser = true;
  //   const notification: MessageType = {
  //     creator: null,
  //     content: this.username + " has joined the chat room!",
  //     datetime:null
  //   };
  //   this.mainService.login(notification);
  // }

  // onSendMessage(form: NgForm, group: number) {
  //   if (form.invalid) {
  //     return;
  //   }
  //   const creator:CreatorType={
  //     _id:this.currentUser._id,
  //     firstName:this.username,
  //     lastName:'',
  //     nickName:''
  //   };
  //   const message: MessageType = {
  //     content: form.value.typein,
  //     creator: creator,
  //     datetime:null
  //   };
  //     this.mainService.sendMessageOne(message,group);
  //     form.setValue({typein:""});
  // }

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
    this.resizeSub.unsubscribe();
  }

}
