import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from './main.service';
import { Subscription } from '../../node_modules/rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'Veery';
  backgroundUrl=null;//"https://66.media.tumblr.com/247552e99214b35e9a337664239a2170/tumblr_n8pzxuF5XJ1s5qng0o9_1280.png";

  backgroundPicSub:Subscription;
  constructor(private mainService:MainService){}
  ngOnInit(){
    this.backgroundPicSub=this.mainService.getBackGroundPicListener().subscribe(url=>{
      if(this.backgroundUrl){
        //this.backgroundUrl=url;
      console.log(this.backgroundUrl)

      }

    });
  }
  ngOnDestroy(){

  }
}
