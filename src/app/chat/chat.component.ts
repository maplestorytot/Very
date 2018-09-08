import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChatService } from "../chat.service";
import { NgForm } from "../../../node_modules/@angular/forms";
import { Subscription } from "../../../node_modules/rxjs";
import { MessageType } from "../message.model";
import { ChatGroupType } from "../chatGroup.model";

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
  // chatDisplay: boolean[] = [false, false, false];
  // currentMsgNotif: MessageType[] = [];

  putInUser = false;
  private messagesSub: Subscription;
  private notificationSub: Subscription;
  private chatNumberSub: Subscription;
  private username: string;
  // an array of either messages or notifications

  // currentMessages:MessageType[]=[];
  // injecting the authentification service
  constructor(private chatService: ChatService) {}
  // put the receive messages in here so that it doesn't create more than one instance of the messages
  ngOnInit() {
    this.messagesSub = this.chatService
      .receiveMessageOne()
      .subscribe(newMsg => {
        this.chatGroups[newMsg.chatNumber].messages.push(newMsg.message);
      });
    this.notificationSub = this.chatService
      .newUserJoinRoomOne()
      .subscribe(newNotif => {
        this.chatGroups[newNotif.chatNumber].messages.push(newNotif.name);
      });
      // this is updating the display connected to the component.html because there has been a change to the
      // chat boxes joined
    this.chatNumberSub = this.chatService.getChatBox().subscribe(chatNumber => {
      this.chatGroups = chatNumber;

    });
  }
  onLoginUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.username = form.value.username;
    this.putInUser = true;
    const notification: MessageType = {
      creator: null,
      content: this.username + " has joined the chat room!"
    };
    this.chatService.login(notification);
  }

  onSendMessage(form: NgForm, group: number) {
    if (form.invalid) {
      return;
    }
    const message: MessageType = {
      content: form.value.typein,
      creator: this.username
    };
      this.chatService.sendMessageOne(message,group);
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
    this.notificationSub.unsubscribe();
    this.chatNumberSub.unsubscribe();
  }
}
