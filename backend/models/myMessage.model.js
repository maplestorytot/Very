const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    creator:{type:mongoose.Schema.Types.ObjectId, required: true,ref:'User'},
    content:{type:String, required:true},
    time:{type:String,required:true}
});


//first is name of model, second is schema
module.exports=mongoose.model('ChatMessage',messageSchema);
