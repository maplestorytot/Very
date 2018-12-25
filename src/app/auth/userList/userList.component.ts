import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "../../../../node_modules/rxjs";
import { NgForm } from "../../../../node_modules/@angular/forms";
import { MainService } from "../../main.service";
import { User } from "../auth.model";
import { CreatorType } from "../../creator.model";
import { ResponsiveService } from "../../responsive.service";
import { Router } from "../../../../node_modules/@angular/router";

@Component({
  templateUrl: "./userList.component.html",
  styleUrls: ["./userList.component.css"]
})
export class UserListComponent implements OnInit, OnDestroy {
  constructor(public mainService: MainService,private responsiveService:ResponsiveService, private router: Router) {}
  // subscription to mainservice's getAllOfTheUsersListener
  private allOfUsersSub: Subscription;
  private resizeSub:Subscription;
  allUserList: User[];
  currentVideoCalls=[];
  isMobile:boolean;
  ngOnInit() {
    // update the existing user list to display
    this.allOfUsersSub = this.mainService
      .getAllOfTheUsersListener()
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
  ngOnDestroy() {
    this.allOfUsersSub.unsubscribe();

  }
}
