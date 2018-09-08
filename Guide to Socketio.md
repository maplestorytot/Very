How to connect to a socket io while sending a parameter
1)  Client side:
  ?name
   io.connect("http://localhost:3000/chatRoomOne?name="+this.getUserId();

2) Server Side

  chatRoomOne.on('connection',(socket)=>{
  console.log('new user connected: ' + socket.handshake.query.name)
