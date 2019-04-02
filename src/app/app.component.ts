import { Component, OnInit, OnDestroy } from "@angular/core";
import { MainService } from "./main.service";
import { Subscription } from "../../node_modules/rxjs";
import { ResponsiveService } from "./responsive.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  title = "Veery";
  backgroundUrl = null; //"https://66.media.tumblr.com/247552e99214b35e9a337664239a2170/tumblr_n8pzxuF5XJ1s5qng0o9_1280.png";

  isMobile=false;
  state={
    isChat:true,
    isUserList:true,
    isOther:true
  }

  backgroundPicSub: Subscription;
  responsiveSub: Subscription;
  stateSub:Subscription;

  constructor(
    private mainService: MainService,
    private responsiveService: ResponsiveService
  ) {}
  ngOnInit() {
    this.backgroundPicSub = this.mainService
      .getBackGroundPicListener()
      .subscribe(url => {
        if (this.backgroundUrl) {
          //this.backgroundUrl=url;
          console.log(this.backgroundUrl);
        }
      });

    this.responsiveSub = this.responsiveService
      .getIsMobile()
      .subscribe(_isMobile => {
        if (_isMobile) {
          console.log("Mobile device detected");
        } else {
          console.log("Desktop detected");

        }
        this.isMobile=_isMobile;

      });




      this.stateSub=this.responsiveService.getState().subscribe(_state=>{
        if(this.isMobile && _state){
          this.state=_state;
        }
      });
      // mobile1a-app.component.html calls resize method when it is created or mobile1 occurs
      this.onResize();
  }

  //mobile2-app.component.ts onResize method is called, calls responsive service checking if its a mobile device
  onResize() {
    this.responsiveService.checkMobile();
  }
  ngOnDestroy() {}
}
