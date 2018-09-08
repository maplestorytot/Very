import { Component } from "../../../node_modules/@angular/core";
import { NgForm } from "../../../node_modules/@angular/forms";
import { ChatService } from "../chat.service";

@Component({
  selector:"group-component",
  templateUrl:"./group.component.html",
  styleUrls:['./group.component.css']
})

export class GroupComponent{
  constructor(public chatServ:ChatService){}
  onJoinGroupA(groupNumber:number){
    this.chatServ.joinChatRoomOne(groupNumber);
  }
  onJoinGroupB(){
    //this.chatServ.joinChatRoomTwo();

  }
  onJoinGroupC(){

  }
}
