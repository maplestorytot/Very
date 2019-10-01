
import { Component, OnInit, OnDestroy } from "@angular/core";
import { MainService } from "../main.service";
import { CreatorType } from "../creator.model";
import { ActivatedRoute, ParamMap, Router } from "../../../node_modules/@angular/router";


@Component({
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileUser:CreatorType;

  constructor(public mainService: MainService,  public route: ActivatedRoute, private router: Router) {

  }
  ngOnInit(){
    // psts1c) note: this is done through parammap which takes the parameter userId348043
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // if has a url paramaters/parammap has a postid then in edit mode
      if (paramMap.has("userId")) {
        this.profileUser=this.mainService.getSpecificUser(paramMap.get("userId"));
      }
      else{
        this.router.navigate(['']);
      }
    });
  }

  ngOnDestroy() {
   }
}
