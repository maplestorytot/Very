import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth.service";
import { Subscription } from "../../../../node_modules/rxjs";
import { NgForm } from "../../../../node_modules/@angular/forms";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent /*implements OnInit, OnDestroy */{
  constructor(public authService: AuthService) {}
  // private authStatusSubscriber: Subscription;

  // ngOnInit() {
  //   this.authStatusSubscriber = this.authService
  //     .getAuthStatusListener()
  //     .subscribe(authStatus => {});
  // }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      // create the user
      this.authService.onCreateUser(
        form.value.firstName,
        form.value.lastName,
        form.value.nickname,
        form.value.username,
        form.value.password
      );
    }
  }
  // ngOnDestroy() {
  //   this.authStatusSubscriber.unsubscribe();
  // }
}
