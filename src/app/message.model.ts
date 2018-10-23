import { Time } from "../../node_modules/@angular/common";

//forces objects to have like a class
export interface MessageType{
  creator:string;
  content:string;
  time:Time;
}
