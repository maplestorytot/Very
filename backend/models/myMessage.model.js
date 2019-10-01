const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  creator:{
    _id:{type:String, required:true},
    //creator:{type:mongoose.Schema.Types.ObjectId, required: true,ref:'User'}
    firstName:{type:String, required:true},
    lastName: {type:String, required:true},
    nickName:{type:String, required:true}
  },



    content:{type:String, required:true},
    time:{type:String,required:true}
});


//first is name of model, second is schema
module.exports=mongoose.model('ChatMessage',messageSchema);
