2018/Sept/08
How to Create different rooms within a server...


JOINING A CHAT ROOM
1) <group.component.ts> 
        <button mat-stroked-button (click)='onJoinGroupA(0)'>Join Group A</button>
        -clicking this button sends it to the <chat.service.ts>
2a) <chat.service.ts>
  
  joinChatRoomOne(groupNumber:number){
    // this changes the display information so that the chat room's joined value is true, allowing it be displayed
    this.chatDisplay[groupNumber].joined=true;
    // this emits a subject/data that is taken within chat component.ts, where it updates it there
    this.chatBox.next([...this.chatDisplay]);
    // the socket now calls the join room one function within server.js that allows you to join the room
    this.chatOneSocket.emit('join room one',this.message,groupNumber);
  }

2b) <chatcomponent.ts/html

  <mat-expansion-panel *ngFor='let chats of chatGroups'>

  This is taking chatGroups from component.ts which was just changed through 2a) due to the subscription

  from chat component.ts
  <this.chatNumberSub = this.chatService.getChatBox().subscribe(chatNumber => {
      this.chatGroups = chatNumber;

2c) How did I display based on the chat rooms?
    -create <chatGroup.model.ts>, which has 
<export interface ChatGroupType{
  joined:boolean,
  messages:MessageType[],
  groupNumber:number
}

  -the joined boolean is for if we should display that value
  -the messages contains the messages from that groupNumber and is updated at
   <ngOnInit() {
    this.messagesSub = this.chatService
      .receiveMessageOne()
      .subscribe(newMsg => {
        this.chatGroups[newMsg.chatNumber].messages.push(newMsg.message);
      });>
  -groupNumber is sented from 1)
  

3a) <server.js>
**note**: socket is always connected at the beginning with chatserver.ts    
<private chatOneSocket=io.connect('http://localhost:3000/chatRoom');
  -/chatroom is a namespace, not essential but just helps to 
  <chatRoom.on("connection", client => {}
3b) 
 //this is the joining a specific room within the name space
  <client.on("join room one", (name, groupNumber) => {
    console.log(name.content);
    // adding the client to the room
    <client.join("room" + groupNumber);>
    <!--This is where the client socket is added to the group group created by concantonation of room and groupNumber-->

3c) how to get the groupNumber is from chat.component.html
      <form *ngIf='putInUser==true&& chats.joined===true' (submit)="onSendMessage(socketForm,chats.groupNumber)" #socketForm='ngForm'>
      when submitting, take the chats.groupNumber from the *ngFor loop because it was created with that set of data



copy of server.js for reference
<chatRoom.on("connection", client => {
  // sockets' functions...

  //this is the joining a specific room within the name space
  <client.on("join room one", (name, groupNumber) => {
    console.log(name.content);
    // adding the client to the room
    <client.join("room" + groupNumber);>
    <!--This is where the client socket is added to the group group created by concantonation of room and groupNumber-->
    // chatRoom emits to roomOne clients an event
    // event: new user connected: passes name as a parameter
    chatRoom.to("room" + groupNumber).emit("new user connected one", name, groupNumber);
  });
  //sending a chat message
  client.on("send chat message one",( msg,groupNumber) => {
    //add to db message
    //sends meesage to all those connected to roomOne
    chatRoom.to("room" + groupNumber).emit("receive message one", msg, groupNumber);
  });


  client.on("disconnect", function() {
    console.log("user disconnected");
  });
});


MESSAGING WITHIN A CHAT ROOM
Now that the chat room is in display
1)  <chat.component.html>
     <form *ngIf='putInUser==true&& chats.joined===true' (submit)="onSendMessage(socketForm,chats.groupNumber)" #socketForm='ngForm'>

whenever a message is submitted, I will also send the group number from which it was made by within the *ngFor loop
-the chat.component.ts then connects to service

2)  <chat.service.ts>

<sendMessageOne(newMessage: MessageType,groupNumber:number) {

    this.chatOneSocket.emit("send chat message one", newMessage,groupNumber);
  }

  connect to socket and emit the message with the group Number

3) <server.js>
   <client.on("send chat message one",( msg,groupNumber) => {
    <!--//sends meesage to all those connected to roomOne-->
    chatRoom.to("room" + groupNumber).emit("receive message one", msg, groupNumber);
  });

  -"room" + groupNumber is string conncantation to connect to that room
4) <chat.service.ts>

  <receiveMessageOne() {
    const messagesUpdated = new Subject<{message:any,chatNumber:number}>();
    this.chatOneSocket.on("receive message one", (msg:MessageType,groupNumber:number)=> {
      console.log(this.chatOneSocket);
      messagesUpdated.next({message:msg,chatNumber:groupNumber});
    });
    return messagesUpdated.asObservable();
  }
  takes the messages and emits it to the chat.compoent.ts 

5) <chat.compoent.ts >
the messages contains the messages from that groupNumber and is updated at 

 <this.messagesSub = this.chatService
      .receiveMessageOne()
      .subscribe(newMsg => {
        this.chatGroups[newMsg.chatNumber].messages.push(newMsg.message);
      });











<chatRoom.on("connection", client => {
  // sockets' functions...

  //this is the joining a specific room within the name space
  <client.on("join room one", (name, groupNumber) => {
    console.log(name.content);
    // adding the client to the room
    <client.join("room" + groupNumber);>
    <!--This is where the client socket is added to the group group created by concantonation of room and groupNumber-->
    // chatRoom emits to roomOne clients an event
    // event: new user connected: passes name as a parameter
    chatRoom.to("room" + groupNumber).emit("new user connected one", name, groupNumber);
  });
  //sending a chat message
  client.on("send chat message one",( msg,groupNumber) => {
    //add to db message
    //sends meesage to all those connected to roomOne
    chatRoom.to("room" + groupNumber).emit("receive message one", msg, groupNumber);
  });


  client.on("disconnect", function() {
    console.log("user disconnected");
  });
});














Extra stuff I didn't use but cool to know
How to connect to a socket io while sending a parameter
1)  Client side:
  ?name
   io.connect("http://localhost:3000/chatRoomOne?name="+this.getUserId();

2) Server Side

  chatRoomOne.on('connection',(socket)=>{
  console.log('new user connected: ' + socket.handshake.query.name)
