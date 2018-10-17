const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  messageStash:{type:mongoose.Schema.Types.ObjectId, required: true,ref:'ChatMessage' },
  users:{type:mongoose.Schema.Types.ObjectId,required:true, ref:'User'}
});


//first is name of model, second is schema
module.exports=mongoose.model('SingleChat',groupSchema);
