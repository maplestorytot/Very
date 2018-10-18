import { Injectable } from "@angular/core";


import { Router } from "../../../node_modules/@angular/router";
import * as io from "socket.io-client";
import { SignUpModel } from "./auth.model";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { Subject } from "../../../node_modules/rxjs";
import { MessageType } from "../message.model";

// keep here because could make more than 1 service
@Injectable({
  providedIn: "root"
})
export class AuthService  {
  private chatOneSocket:io;

  private chatSocket=new Subject<io>();
  getChatSocket(){
    return this.chatSocket.asObservable();
  }
  getChatSocketIo(){
    return this.chatOneSocket;
  }
  // private authStatusListener = new Subject<boolean>();
  // getAuthStatusListener() {
  //   return this.authStatusListener.asObservable();
  // }

  constructor(private http: HttpClient, private router: Router) {}

  onLogin(username: string, password: string) {
    this.chatOneSocket=io.connect('http://localhost:3000/');

      console.log(username + password)
      console.log({username:username,password:password});
      this.chatOneSocket.emit('authentication',{username:username,password:password});

      this.chatOneSocket.on('new user connected one',(myName:MessageType,groupNumber:number)=>{
        console.log(myName.creator);
    });
      this.chatSocket.next(this.chatOneSocket);


  }

  onCreateUser(
    firstName: string,
    lastName: string,
    nickName: string,
    username: string,
    password: string

  ) {
    const signUpUser:SignUpModel={
      firstName: firstName,
    lastName: lastName,
    nickName: nickName,
    username: username,
    password: password

    }
    console.log(signUpUser);
    this.http.post("http://localhost:3000/api/user/signup",signUpUser).subscribe(()=>{
      this.router.navigate(["/"]);
    },error=>{
      // this.authStatusListener.next(false);
    })
  }

}
