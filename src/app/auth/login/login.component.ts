import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth.service";
import { Subscription } from "../../../../node_modules/rxjs";
import { NgForm } from "../../../../node_modules/@angular/forms";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent /*implements OnInit, OnDestroy */{
  // injecting the authentification service
  constructor(public authService: AuthService) {}
  private authStatusSub: Subscription;

  // ngOnInit() {
  //   this.authStatusSub = this.authService
  //     .getAuthStatusListener()
  //     .subscribe(authStatus => {
  //     });
  // }

  // ngOnDestroy() {
  //   this.authStatusSub.unsubscribe();
  // }
  // checking for validation
  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.authService.onLogin(form.value.username, form.value.password);
    console.log(form.value.username, form.value.password)
  }

}
