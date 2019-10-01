import { Time } from "../../node_modules/@angular/common";
import { CreatorType } from "./creator.model";

//forces objects to have like a class
export interface MessageType{
  creator:CreatorType;
  content:string;
  time:Time;
}
