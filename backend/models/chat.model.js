const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
  name:String,
  messageStash:[ {


    creator:{
      _id:{type:String, required:true},
      //creator:{type:mongoose.Schema.Types.ObjectId, required: true,ref:'User'}
      firstName:{type:String, required:true},
      lastName: {type:String, required:true}
    },
    content:{type:String, required:true},
    datetime:{type:Date,required:true}
}],
  users:[{
    _id:{type:mongoose.Schema.Types.ObjectId,required:true, ref:'User'},
    //creator:{type:mongoose.Schema.Types.ObjectId, required: true,ref:'User'}
    firstName:{type:String, required:true},
    lastName: {type:String, required:true}
  }
 ]
});


//first is name of model, second is schema
module.exports=mongoose.model('Chat',chatSchema);
