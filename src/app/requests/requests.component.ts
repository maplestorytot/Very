// import { Component } from "../../../node_modules/@angular/core";
import { Component } from "@angular/core";

import { MainService } from "../main.service";
import { Subscription } from "rxjs";
// import { Component } from "@angular/core";
// import { GroupService } from "./group.service";

@Component({
  selector:"requests-component",
  templateUrl:"./requests.component.html",
  styleUrls:['./requests.component.css']
})

export class RequestComponent{

  
  constructor( public mainService:MainService){}
  requests=[];
  ngOnInit(){
  this.requests=this.mainService.getRequests();

  }
  onAcceptRequest(requestId){
    // delete the requests from front end
    console.log(this.requests);
    this.requests.forEach((req,index)=>{
      if(req.toString()==requestId){
        this.requests.splice(index,1);
      }
    })
    this.mainService.acceptRequest(requestId)
  }
  onDenyRequest(requestId){
    this.mainService.denyRequest(requestId);
  } 
  
  // onJoinGroupA(groupNumber:number){
  //   this.groupService.joinChatRoomOne(groupNumber);
  // }
  // onJoinGroupB(groupNumber:number){
  //   this.groupService.joinChatRoomOne(groupNumber);

  // }
  // onJoinGroupC(groupNumber:number){
  //   this.groupService.joinChatRoomOne(groupNumber);

  // }
}
