import { Component } from "@angular/core";
import { NgForm } from "../../../../node_modules/@angular/forms";
import { MainService } from "../../main.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent /*implements OnInit, OnDestroy */{
  constructor(public mainService: MainService) {}
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
      this.mainService.onCreateUser(
        form.value.firstName,
        form.value.lastName,
        form.value.username,
        form.value.password,
        [],
        -1,
        '',
        '',
        [],
        []
      );
    }
  }
  // ngOnDestroy() {
  //   this.authStatusSubscriber.unsubscribe();
  // }
}
