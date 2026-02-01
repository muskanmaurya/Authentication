import { z } from "zod"

export const userSchema=z.object({
    username:z.string().min(3,"username must be atleast 3 letter").trim(),

    email:z.string().email("Invalid email format").trim().toLowerCase(),

    password:z.string().min(4,"password must be atleast 4 characters long")

})

export const loginSchema=z.object({
    email:z.string().email("Invalid email format").trim().toLowerCase(),
    password:z.string().min(4,"password must be atleast 4 characters long")
})

export const emailSchema=z.object({
    email:z.string().email("Invalid email format").trim().toLowerCase()
})

export const otpSchema=z.object({
    otp:z.string().length(6,"OTP must be 6 digits")
})

export const resetPasswordSchema=z.object({
    newPassword:z.string().min(4,"password must be atleast 4 characters long"),
    confirmPassword:z.string().min(4,"password must be atleast 4 characters long")
})

export const validateUser=(schema)=>async(req, res, next)=>{
    try {
        await schema.parseAsync(req.body);
        next();
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({
                success:false,
                message:"Validation failed",
                errors:error.errors.map(err=>({
                    field:err.path.join('.'),
                    message:err.message
                }))
            })
        }
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}