import jwt from "jsonwebtoken";
import { verifyemail } from "../emailVerify/verifyemail.js";
import {User} from "../models/usermodel.js"
import {Session} from "../models/sessionModel.js"
import bcrypt from "bcryptjs"
import "dotenv/config";
import { sendOtpMail } from "../emailVerify/sendOtpMail.js";

export const registerUser=async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        if(!username||!email||!password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }

        const hashedpassword= await bcrypt.hash(password,10)
        const newUser=await User.create({
            username,
            email,
            password:hashedpassword
        })

        const token = await jwt.sign({id:newUser._id},process.env.SECRET_KEY,{expiresIn:"1440m"})

        await verifyemail(token, email )
        newUser.token=token
        await newUser.save();

        return res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:newUser
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })

    }
}

export const verification=async(req,res)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader||!authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Authorization token is missing or invalid"
            }) 
        }

        const token=authHeader.split(" ")[1];

        let decoded;
        try{
            decoded = jwt.verify(token,process.env.SECRET_KEY);
        }catch(error){
            if(error.name==="TokenExpiredError"){
                return res.status(400).json({
                    success:false,
                    message:"the registeration token has expired"
                })
            }
            return res.status(400).json({
                success:false,
                message:"token verification failed"
            })
        }
        const user=await User.findById(decoded.id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }

        user.token=null
        user.isVerified=true
        await user.save();
        return res.status(200).json({
            success:true,
            message:"email verified successfully"
        })
        
    }catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        })

    }
}

export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }

        const user=await User.findOne({email})
        if(!user){
            return res.status(401).json({
                success:false,
                message:"unauthorized access" 
            })
        }

        const passwordcheck=await bcrypt.compare(password, user.password)

        if(!passwordcheck){
            return res.status(402).json({
                success:false,
                message:"incorrect password"
            })
        }

        //check if user is verified of not
        if(user.isVerified!== true){
            return res.status(403).json({
                success:false,
                message:" verify account than login"
            })
        }

        //check for existing session and delete it

        const existingSession=await Session.findOne({userId:user._id})
        if(existingSession){
            await Session.deleteOne({userId:user._id})
        }

        //create a new session
        const newSession = await Session.create({userId:user._id})
        console.log("Session created:", newSession);

        //generate tokens
        //it takes 3 things,payload is id,secret key,expires in , so accesstoke is short lived and refresh token is long lived so when access token is expired we can generate it with refresh token
        const accessToken=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"10d"})
        const refreshToken=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"30d"})

        user.isLoggedIn=true
        await user.save()
        return res.status(200).json({
            success:true,
            message:`Welcome back ${user.username}`,
            accessToken,
            refreshToken,
            user
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })

    }
}

export const logoutUser=async(req,res)=>{
    try{

        const userId=req.userId;
        await Session.deleteMany({userId});
        await User.findByIdAndUpdate(userId,{isLoggedIn:false})
        return res.status(200).json({
            success:true,
            message:"logged out successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const forgotPassword=async(req,res)=>{
    try {
        const {email}=req.body;
        const user=await User.findOne({email})

        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        const otp=Math.floor(100000+Math.random()*900000).toString()
        const expiry=new Date(Date.now()+10*60*1000)
        
        user.otp=otp;
        user.otpExpiry=expiry;
        await user.save()
        await sendOtpMail(email,otp)
        return res.status(200).json({
            success:true,
            message:"OTP sent to your email"
        })
    } catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const verifyOtp=async(req,res)=>{
    const {otp}=req.body
    const email=req.params.email
    if(!otp){
        return res.status(400).json({
            success:false,
            message:"OTP is required"
        })
    }

    try {
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        if(!user.otp || !user.otpExpiry){
            return res.status(400).json({
                success:false,
                message:"OTP not generated or already verified"
            })
        }

        if(user.otpExpiry<new Date()){
            return res.status(400).json({
                success:false,
                message:"OTP has expired. Please request a new one"
            })
        }

        if(otp!==user.otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        user.otp=null
        user.otpExpiry=null
        await user.save()

        return res.status(200).json({
            success:true,
            message:"OTP verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
        
    }
}

export const changePassword=async(req,res)=>{
    const {newPassword,confirmPassword} =req.body
    const email=req.params.email
    if(!newPassword||!confirmPassword){
        return res.status(400).json({
            success:false,
            message:"All fields are requried"
        })
    }

    if(newPassword !== confirmPassword ){
        return res.status(400).json({
            success:false,
            message:"Password does not match"
        })
    }

    try {
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }

        const hashedPassword=await bcrypt.hash(newPassword,10)
        user.password=hashedPassword
        await user.save()

        return res.status(200).json({
            success:true,
            message:"password changed successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal serevr error"
        })
        
    }
}