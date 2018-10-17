const User=require('../models/user.model')
const bycrpt = require("bcryptjs"); //npm install --save bcryptjs

exports.createUser=(req,res,next)=>{
  //this is encrypting our password from the request
 //the second is salt0r ground which higher number means longer but more safer
 //the result of then is the hash encrypted...
bycrpt.hash(req.body.pasword,10).then(hash=>{
 const user =new User({
   firstName:req.body.firstName,
   lastName:req.body.lastName,
   nickName:req.body.nickName,
   username:req.body.username,
   password:req.body.password
 });
 //saving the user into the database
 user.save().then(result=>{
   res.status(201).json({
     message:"user created",
     result:result
 });
 }).catch(err=>{
   res.status(500).json({message:'Invalid Authentification credentials!'});
 })

})
}
