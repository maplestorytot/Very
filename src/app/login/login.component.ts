import { Component } from "@angular/core";
import { ChatService } from "../chat.service";
import { NgForm } from "../../../node_modules/@angular/forms";

@Component({
  selector: "app-login",

  template: `<form (submit)="onLogin(loginForm)" #loginForm='ngForm' *ngIf='loggedIn==false'>
  <input type="text" placeholder="What is your name? "  name="username" ngModel #username="ngModel" required minlength="3">

<br>
<button mat-button type="submit">submit</button>
</form>
<app-chat *ngIf='loggedIn==true'></app-chat><group-component *ngIf='loggedIn==true'></group-component>`
  ,
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  public loggedIn=false;
  // private userSub:Subscription;
  // injecting the authentification service
  constructor(private chatService: ChatService) {}
  // put the receive messages in here so that it doesn't create more than one instance of the messages

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.chatService.login(form.value.username);
    this.loggedIn=true;

  }
}
