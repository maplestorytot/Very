import { MessageType } from "./message.model";
import { User } from "./auth/auth.model";

//forces objects to have like a class
export interface SingleChatType{
  chatId:string;
  messages:MessageType[];
  users:User[];
}
