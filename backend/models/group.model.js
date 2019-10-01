const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  groupName:{type:String, required:true},
  messageStash:[{type:mongoose.Schema.Types.ObjectId, required: true,ref:'ChatMessage' }],
  users:[{type:mongoose.Schema.Types.ObjectId,required:true, ref:'User'}],
  password:{type:String, required:true}
});


//first is name of model, second is schema
module.exports=mongoose.model('GroupChat',groupSchema);
