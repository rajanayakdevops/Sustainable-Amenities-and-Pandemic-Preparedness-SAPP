
const http = require('http');

const server =  http.createServer((req,res)=>{
  console.log(" server started successfully ");
}).listen(8000,()=>{
  console.log(" server started at port 8000");
});