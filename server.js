
const e = require('express');
const express = require('express');

const app = express();


app.use((req,res,next) => {
  console.log(req.headers);
});

app.listen(8000,()=>{
  console.log("server started at port 8000");
})