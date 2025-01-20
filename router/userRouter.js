const express = require('express');
const userController = require("../controller/userController");

const userRouter = express.Router();

userRouter.get('/',(req,res)=>{
  return res.render("home");
});

userRouter.post('/',userController.postSaveUserInfo);


userRouter.get('/signup',(req,res)=>{
  return res.render("signup");
});


userRouter.get('/login',(req,res)=>{
  return res.render("login");
});

userRouter.post('/SAPP',userController.handleUserLogin);
userRouter.get('/profile',userController.getUserProfile);





exports.userRouter = userRouter;