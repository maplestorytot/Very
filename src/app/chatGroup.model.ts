import { MessageType } from "./message.model";

//forces objects to have like a class
export interface ChatGroupType{
  joined:boolean,
  messages:MessageType[],
  groupNumber:number
}
