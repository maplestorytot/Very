import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "../../../../node_modules/rxjs";
import { NgForm } from "../../../../node_modules/@angular/forms";
import { MainService } from "../../main.service";
import { User } from "../auth.model";

@Component({
  templateUrl: "./userList.component.html",
  styleUrls: ["./userList.component.css"]
})
export class UserListComponent implements OnInit,OnDestroy{
constructor(public mainService:MainService){}
  // subscription to mainservice's getAllOfTheUsersListener
  private allOfUsersSub: Subscription;
  allUserList:User[];
  ngOnInit() {
    // update the existing user list to display
    this.allOfUsersSub = this.mainService.getAllOfTheUsersListener().subscribe(allUser=>{
      this.allUserList=allUser;
    });

  }
   onOpenSingleChat(friendId:string){

    this.mainService.openSingleChat(friendId)
    }
ngOnDestroy(){
  this.allOfUsersSub.unsubscribe();
}
}
