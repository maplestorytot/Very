// import { Component } from "../../../node_modules/@angular/core";

import { MainService } from "../main.service";
import { Component } from "@angular/core";
// import { GroupService } from "./group.service";

@Component({
  selector:"group-component",
  templateUrl:"./group.component.html",
  styleUrls:['./group.component.css']
})

export class GroupComponent{

  constructor( public groupService:MainService){}
  onJoinGroupA(groupNumber:number){
    this.groupService.joinChatRoomOne(groupNumber);
  }
  onJoinGroupB(groupNumber:number){
    this.groupService.joinChatRoomOne(groupNumber);

  }
  onJoinGroupC(groupNumber:number){
    this.groupService.joinChatRoomOne(groupNumber);

  }
}
