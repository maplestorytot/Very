import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Subject } from "../../../node_modules/rxjs";
import { MainService } from "../main.service";
import { UserType } from "../models/user.model";
import { ResponsiveService } from "../responsive.service";

@Component({
  //allows this component to be used
  selector: "app-header",
  //uses html file
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy{
   userIsAuthenticated=false;
  private authListenerSubs:Subscription;
  private currentUserSub:Subscription;

  currentUser:UserType;
  constructor(private mainService:MainService, private responsiveService:ResponsiveService){}

  ngOnInit(){

   this.userIsAuthenticated = this.mainService.getIsAuth();
    this.authListenerSubs=this.mainService.getAuthenticatedListener().subscribe(isAuthenticated=>{

      this.userIsAuthenticated=isAuthenticated;
    });
    this.currentUserSub=this.mainService.getCurrentUserListener().subscribe(currentUser=>{
      console.log(currentUser);
      this.currentUser=currentUser;
    });


  }
  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
  onLogout(){
    this.mainService.logout();
    if(this.responsiveService.getCheckIsMobile()){
      this.responsiveService.onChangeState("other");
    }
  }
  onGroups(){
    if(this.responsiveService.getCheckIsMobile()){
      this.responsiveService.onChangeState("other");
      this.mainService.deleteAllChats();

    }
  }
  onLogin(){
    if(this.responsiveService.getCheckIsMobile()){
      this.responsiveService.onChangeState("other");
    }
  }
  onSignUp(){
    if(this.responsiveService.getCheckIsMobile()){
      this.responsiveService.onChangeState("other");
    }
  }
  onOpenFriends(){
    if(this.responsiveService.getCheckIsMobile()){
      this.responsiveService.onChangeState("friendList");
      // emptying opened chats
      this.mainService.deleteAllChats();
    }
  }
  onOpenUserList(){
    if(this.responsiveService.getCheckIsMobile()){
      this.responsiveService.onChangeState("other");
      // emptying opened chats
    
    }
  }

}
