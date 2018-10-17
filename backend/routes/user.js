const express = require("express");
const router = express.Router();
const UserController=require('../controllers/user')


router.post("/signup",UserController.createUser);
module.exports=router;
