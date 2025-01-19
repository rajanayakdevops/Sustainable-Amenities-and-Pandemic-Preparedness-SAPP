const express = require('express');
const userController = require("../controller/userController");

const userRouter = express.Router();

userRouter.get('/',(req,res)=>{
  return res.render("home");
});

userRouter.post('/',(req,res)=>{
  return res.render("home");
});


userRouter.get('/signup',(req,res)=>{
  return res.render("signup");
});


userRouter.get('/login',(req,res)=>{
  return res.render("login");
});

userRouter.post('/SAPP',(req,res)=>{
  return res.send("welcome to your AI assistance ");
});





exports.userRouter = userRouter;