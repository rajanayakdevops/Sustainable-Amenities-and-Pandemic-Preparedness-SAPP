
const express = require('express');
const app = express();


//core Module
const path = require('path');

//local module 
const rootDir = require("./utils/rootpath");

app.use(express.urlencoded());

// this is middleware that make this path public or accessable to all 
app.use(express.static(path.join(__dirname,'public')))





//setting ejs 
app.set('view engine','ejs');
app.set('views','views');


app.get("/",(req,res)=>{
  res.render("home");
})

app.use((req,res)=>{
  res.send("<h1> this page does not found <h1>");
})


app.listen(8000,()=>{
  console.log("server started at port 8000");
})