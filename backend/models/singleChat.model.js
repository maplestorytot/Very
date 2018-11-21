const mongoose = require('mongoose');

const singleSchema = mongoose.Schema({
  messageStash:[ {


    creator:{
      _id:{type:String, required:true},
      //creator:{type:mongoose.Schema.Types.ObjectId, required: true,ref:'User'}
      firstName:{type:String, required:true},
      lastName: {type:String, required:true},
      nickName:{type:String, required:false}
    },


  content:{type:String, required:true},
  time:{type:String,required:true}
}],
  users:[{type:mongoose.Schema.Types.ObjectId,required:true, ref:'User'}]
});


//first is name of model, second is schema
module.exports=mongoose.model('SingleChat',singleSchema);
