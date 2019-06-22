const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    username:{type:String, required:true},
    password:{type:String, required:true},
    email: { type: String, unique: true },
    friendRequests:[{
        _id:{type:mongoose.Schema.Types.ObjectId,required:true, ref:'User'},
        //creator:{type:mongoose.Schema.Types.ObjectId, required: true,ref:'User'}
        firstName:{type:String, required:true},
        lastName: {type:String, required:true}
    }], /* [
        {_id:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        firstName:String,
        lastName:String}
    ], */
    friends:[{
        _id:{type:mongoose.Schema.Types.ObjectId,required:true, ref:'User'},
        //creator:{type:mongoose.Schema.Types.ObjectId, required: true,ref:'User'}
        firstName:{type:String, required:true},
        lastName: {type:String, required:true}
    }],
    chatOpened:[{type:mongoose.Schema.Types.ObjectId, required: false,ref:'SingleChat' }],
    hobbies:[String],
    age:Number,
    birthday:Number,
    country:String,
    knownLanguages:[{
        name:String,
        profiency:String
     }],
    learningLanguages:[{
        name:String,
        profiency:String
     }]
});


//first is name of model, second is schema
module.exports=mongoose.model('User',userSchema);
