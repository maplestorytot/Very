import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "../../../node_modules/rxjs";
import { MainService } from "../main.service";
import { CreatorType } from "../creator.model";

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
  currentUser:CreatorType;
  constructor(private mainService:MainService){}

  ngOnInit(){

   this.userIsAuthenticated = this.mainService.getIsAuth();
    this.authListenerSubs=this.mainService.getAuthenticatedListener().subscribe(isAuthenticated=>{

      this.userIsAuthenticated=isAuthenticated;
    });
    this.currentUserSub=this.mainService.getCurrentUserListener().subscribe(currentUser=>{
      this.currentUser=currentUser;
    })
  }
  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
  onLogout(){
    // this.authService.logout();
  }
}
