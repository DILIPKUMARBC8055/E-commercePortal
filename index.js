import express from 'express';
import productRouter from './src/features/product/product.router.js';
const server = express();

server.use("/api/product",productRouter);
server.get("/",(req,res)=>{res.end("welcome to e-com websit")});

server.listen(8080,()=>{console.log("The server is listening at 8080")});