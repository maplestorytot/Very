const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    nickName:{type:String, required:true},
    username:{type:String, required:true},
    password:{type:String, required:true},
    chatOpened:[{type:mongoose.Schema.Types.ObjectId, required: true,ref:'SingleChat' }]

});


//first is name of model, second is schema
module.exports=mongoose.model('User',userSchema);
