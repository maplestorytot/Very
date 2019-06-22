var socket = io.connect('http://localhost:3000');
let allUsers=[];
let friends=[];
const form =document.querySelector("#login");

form.addEventListener('submit',(e)=>{
    const user= {
    username:e.target.elements.username.value,
    password:e.target.elements.password.value,
    }
    console.log(user);
    e.preventDefault();
    socket.emit('authentication',user,function(token,authenticated){
        if(authenticated){
            console.log('authenticated', token);
        }else{
            console.log('not authenticated');
        }
    })
})

socket.on('get all users', function (users) {
    allUsers=users;
    console.log(data);
});
socket.on('get friends',function(theFriends){
    friends = theFriends;
    console.log(friend);
})