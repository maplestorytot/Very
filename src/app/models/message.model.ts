import { UserType } from "./user.model";

//forces objects to have like a class
export interface MessageType{
  creator:{
    _id:string;
    firstName:string;
    lastName:string;
  };
  content:string;
  datetime:number;
}
