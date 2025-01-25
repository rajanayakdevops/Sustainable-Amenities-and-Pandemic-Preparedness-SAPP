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
userRouter.get('/dashboard',userController.updateUserDashboard);
userRouter.get('/add-medical-center',(req,res)=>{
  return res.render("medicalCenterForm");
});
userRouter.get('/show-medical-center',userController.showNearMedicalCenter);




////  post 

userRouter.post('/',userController.postSaveUserInfo);
userRouter.post('/SAPP',userController.handleUserLogin);
userRouter.post('/submit-risk-form',userController.handleRiskFormSubmission);
userRouter.post('/add-medical-center',userController.addNearMedicalCenter);



exports.userRouter = userRouter;