import { MessageType } from "./message.model";
import { User } from "./auth/auth.model";
import { CreatorType } from "./creator.model";

//forces objects to have like a class
export interface SingleChatType{
  chatId:string;
  messages:MessageType[];
  userObj:CreatorType;
  friendObj:CreatorType;
}
