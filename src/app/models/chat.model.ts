import { MessageType } from "./message.model";
import { UserType } from "./user.model";

//forces objects to have like a class
export interface ChatType{
  _id:string;
  messageStash:MessageType[];
  users:{
    _id:string,
    firstName:string,
    lastName:string
  }[];
}
