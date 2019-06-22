import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";
import { MainService } from "../../main.service";
import { UserType } from "../../models/user.model";
import { ResponsiveService } from "../../responsive.service";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./friendList.component.html",
  styleUrls: ["./friendList.component.css"]
})
export class FriendListComponent implements OnInit, OnDestroy {
  constructor(public mainService: MainService,private responsiveService:ResponsiveService, private router: Router) {}
  // subscription to mainservice's getAllOfTheUsersListener
  private allOfUsersSub: Subscription;
  private resizeSub:Subscription;
  allUserList//: UserType[];
  currentVideoCalls=[];
  isMobile:boolean;
  ngOnInit() {
    // update the existing user list to display
    this.allOfUsersSub = this.mainService
      .getFriendsListener()
      .subscribe(allUser => {
        this.allUserList = allUser;
      });

    this.resizeSub=this.responsiveService.getIsMobile().subscribe(isMobile=>{
      this.isMobile=isMobile;
    });

    // when created check if mobile
    this.responsiveService.checkMobile();
  }
  // gzo2a. userB clicks on userA...
  onOpenSingleChat(friendId: string) {

    this.mainService.openSingleChat(friendId);
    this.router.navigate(["/"]);
    if(this.responsiveService.getCheckIsMobile()){
      this.responsiveService.onChangeState("chat");
    }
  }
  // onOpenVideoCall(friendId:string){
  //   this.currentVideoCalls.push(friendId);
  // }
  onOpenProfile(){
    if(this.responsiveService.getCheckIsMobile()){
      this.responsiveService.onChangeState("other");
    }
  }
  // onAddFriend(friendId:string){
  //   this.mainService.addFriend(friendId);
  // }
  ngOnDestroy() {
    this.allOfUsersSub.unsubscribe();

  }
}
