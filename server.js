
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');


//core Module
const path = require('path');

//local module 
const rootDir = require("./utils/rootpath");
const {userRouter} = require("./router/userRouter");

app.use(express.urlencoded());

// this is middleware that make this path public or accessable to all 
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'views')));



// Session configuration
app.use(session({
  secret: 'mySuperSecretKey123!',  // Secret key for signing session ID
  resave: false,              // Don't save session if not modified
  saveUninitialized: true,    // Save session if it's new (even if unmodified)
}));


//setting ejs 
app.set('view engine','ejs');
app.set('views','views');


app.use(userRouter);


app.use((req,res)=>{
  res.send("<h1> this page does not found <h1>");
})





const mongoURI = 'mongodb://127.0.0.1:27017/SAAP?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.6';


// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully to SAAP database!'))
  .catch(err => console.error('MongoDB connection error:', err));



app.listen(8000,()=>{
  console.log("server started at port 8000");
})