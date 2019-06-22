import { ChatType } from "./chat.model";

//forces objects to have like a class
export interface UserType{
  _id:string;
  firstName:string;
  lastName:string;
  friendRequests:string[];
  friends:UserType[];
  chatOpened:ChatType[];
  username:string;
  password:string;
  hobbies:string[];
  age:Number;
  birthday:string;
  country:string,
  knownLanguages:{
      name:string,
      profiency:string
    }[];
  learningLanguages:{
      name:string,
      profiency:string
    }[];
}
