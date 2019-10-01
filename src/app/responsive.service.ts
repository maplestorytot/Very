import { Injectable } from "../../node_modules/@angular/core";
import { Subject } from "../../node_modules/rxjs";

@Injectable({
  providedIn: "root"
})
export class ResponsiveService {
  private isMobileBoolean:boolean;
  private isMobile = new Subject<boolean>();
  private state=new Subject<any>();
  private theState={
    isChat:false,
    isUserList:false,
    isOther:false
  }
  public screenWidth: string;

  onChangeMobile(status: boolean) {
    this.isMobile.next(status);
  }

  onChangeState(state:string){
    if(state==="desktopMode"){
      this.theState.isUserList=true;
      this.theState.isOther=true;
      this.theState.isChat=true;
    } else if(state==="chat"){
      this.theState.isUserList=false;
      this.theState.isOther=false;
      this.theState.isChat=true;
    }else if(state==="other"){
      this.theState.isUserList=false;
      this.theState.isOther=true;
      this.theState.isChat=false;
    }else if(state==="userList"){
      this.theState.isUserList=true;
      this.theState.isOther=false;
      this.theState.isChat=false;
    }
    this.state.next(this.theState);
  }
  getIsMobile() {
    return this.isMobile.asObservable();
  }
  getCheckIsMobile(){
    return this.isMobileBoolean;
  }
  getState(){
    return this.state.asObservable();
  }
  constructor() {}

  // mobile2-app.component.ts onResize method is called, calls responsive service checking if its a mobile device
  public checkMobile() {
    /*if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      console.log('mobile device detected');
      // mobile3-check mobile sends out an observable isMobile
      this.onChangeMobile(true);
   }*/
    // mobile3-check mobile sends out an observable isMobile

    var width = window.innerWidth;
    if (width <= 768) {
      this.screenWidth = "sm";
      this.onChangeMobile(true);
      // if changing to mobile mode, make it just user list
      this.onChangeState("userList")
      this.isMobileBoolean=true;
    } else if (width > 768 && width <= 992) {
      this.screenWidth = "md";
      this.onChangeMobile(false);
      // if changing to desktop mode, make it all appear
      this.onChangeState("desktopMode")
      this.isMobileBoolean=false;

    } else {
      this.screenWidth = "lg";
      this.onChangeMobile(false);
      this.onChangeState("desktopMode")
      this.isMobileBoolean=false;

    }
    console.log(this.theState);

  }
}
