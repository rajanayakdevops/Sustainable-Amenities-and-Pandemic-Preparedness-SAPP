const express = require('express');
const userController = require("../controller/userController");

const userRouter = express.Router();

// get 

userRouter.get('/',(req,res)=>{
  return res.render("home");
});

userRouter.get('/signup',(req,res)=>{
  return res.render("signup");
});


userRouter.get('/login',(req,res)=>{
  return res.render("login");
});

userRouter.get('/showForm',userController.handleFormRequest);
userRouter.get('/profile',userController.getUserProfile);
userRouter.get('/dashboard/:riskCategory',userController.updateUserDashboard);

////  post 

userRouter.post('/',userController.postSaveUserInfo);
userRouter.post('/SAPP',userController.handleUserLogin);
userRouter.post('/submit-risk-form',userController.handleRiskFormSubmission);


exports.userRouter = userRouter;