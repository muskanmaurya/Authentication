import express from "express"
import dotenv from "dotenv"
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoutes.js"
import cors from 'cors'

dotenv.config();

const app=express();

const PORT=process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cors({
    origin:['http://localhost:5173', 'http://localhost:5174'],
    credentials:true
}))

app.use('/user',userRoute);

//https://localhost:8000/user/register

app.listen(PORT,()=>{
    connectDB();
    console.log(`server is listening at port ${PORT}`);
})
