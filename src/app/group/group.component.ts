import { Component } from "../../../node_modules/@angular/core";
import { NgForm } from "../../../node_modules/@angular/forms";
import { ChatService } from "../chat.service";
import { MainService } from "../main.service";

@Component({
  selector:"group-component",
  templateUrl:"./group.component.html",
  styleUrls:['./group.component.css']
})

export class GroupComponent{

  constructor(public chatServ:ChatService,public mainService:MainService){}
  onJoinGroupA(groupNumber:number){
    this.mainService.joinChatRoomOne(groupNumber);
  }
  onJoinGroupB(groupNumber:number){
    this.mainService.joinChatRoomOne(groupNumber);

  }
  onJoinGroupC(groupNumber:number){
    this.mainService.joinChatRoomOne(groupNumber);

  }
}
