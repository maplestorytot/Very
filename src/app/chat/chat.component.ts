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


      // console.log(newMessage)

      // // open chat box if not already opened
      var createChat=true;
      let i;
      console.log(this.singleChat.length);
      for (i=0;i<this.singleChat.length;i++) {
        if(messageInfo.chatId==this.singleChat[i].chatId){
          console.log('make it baby')
          createChat=false;
          break;
        }else{

        }
      }
        if(createChat==true){
           //get messages, should create a new chat box
           //console.log(messageInfo.userId,this.currentUser._id)

          this.mainService.openSingleChat(messageInfo.userId);
        }
        else{

        this.singleChat[i].messages.push(newMessage);
        }



















      //     // const newSingleChat:SingleChatType={
      //     //   chatId:messageInfo.chatId,
      //     //   friendId:messageInfo.ch.friendId,
      //     //   userId:messageInfo.userId,
      //     //   messages:messageInfo.message


      //     // }
      //     // console.log(newSingleChat);

          // this.singleChat.push(newSingleChat);

      //   }


        // console.log(i)
        // console.log(this.singleChat[i])
        // console.log(this.singleChat)
        // this.singleChat[i].messages.push(newMessage);
      //   console.log(i)
      //   console.log(this.singleChat[i])
      //   console.log(this.singleChat)
      // }








    //   if(this.singleChat.length>=1){
    //     let i;
    //   for (i=0;i<this.singleChat.length;i++) {
    //     // adding message to the chat
    //     if(messageInfo.chatId==this.singleChat[i].chatId){
    //       this.singleChat[i].messages.push(newMessage);

    //       //creating a new chat if it isn't up yet
    //     } else{
    //       const newSingleChat:SingleChatType={
    //         chatId:messageInfo.chatId,
    //         friendId:chat.friendId,
    //         userId:chat.userId,
    //         messages:chat.chatMessages


    //       }
    //       console.log(newSingleChat);

    //       this.singleChat.push(newSingleChat);

    //     }
    //   }
    //  } else{
    //     const newSingleChat:SingleChatType={
    //       chatId:chat.chatId,
    //       friendId:chat.friendId,
    //       userId:chat.userId,
    //       messages:chat.chatMessages


    //     }

    //     this.singleChat.push(newSingleChat);

    //   }



    });

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
          friendId:chat.friendId,
          userId:chat.userId,
          messages:chat.chatMessages


        }
        //console.log(newSingleChat.messages)
        this.singleChat.push(newSingleChat);
      }
/*

      let exist=false;

      // console.log(this.singleChat.length);
     // if the length is greater than one, then run the for loop, otherwise,
      if(this.singleChat.length>=1){
        let i;
      for (i=0;i<this.singleChat.length;i++) {

        if(chat.chatId==this.singleChat[i].chatId){
          exist=false;
          break;
        } else{
          exist=true;

        }

      }
     } else{
        const newSingleChat:SingleChatType={
          chatId:chat.chatId,
          friendId:chat.friendId,
          userId:chat.userId,
          messages:chat.chatMessages


        }

        this.singleChat.push(newSingleChat);

      }
      if(Boolean(exist)===true){
        const newSingleChat:SingleChatType={
          chatId:chat.chatId,
          friendId:chat.friendId,
          userId:chat.userId,
          messages:chat.chatMessages


        }

        this.singleChat.push(newSingleChat);

      }


*/


    });

    }



  onSendSingleMessage(form:NgForm,singleChat){
    if(form.invalid){
    return;
    }
    const creator:CreatorType={
      _id:this.currentUser._id,
      firstName:this.currentUser.firstName,
      lastName:this.currentUser.lastName,
      nickName:this.currentUser.nickName
    };
    const newSingleMessage:MessageType={
        creator:creator,
        content:form.value.textIn,
        time:null

    }
    this.mainService.sendMessageSingle(singleChat.userId,singleChat.friendId,newSingleMessage,singleChat.chatId);
    form.setValue({textIn:""});
    // var out = document.getElementById("scroller-wrapper");
    // out.scrollTop=out.scrollHeight-out.clientHeight;
    // var messageBody = document.querySelector('#messageBody');
    // messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

    //This is to make the scroller always be at the bottom

    // // allow 1px inaccuracy by adding 1
    // var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
    // if(isScrolledToBottom){
    // out.scrollTop = out.scrollHeight - out.clientHeight;
    // }
  }


  clearChats(index){
    this.singleChat.splice(index,1);
    console.log(this.singleChat.length)
  }














  onLoginUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
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
