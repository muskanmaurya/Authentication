import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { toast } from "sonner"

const VerifyOtp = () => {
    const { email } = useParams()
    const navigate = useNavigate()
    
    console.log("VerifyOtp Component Loaded - Email from params:", email)
    
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1) // Step 1: OTP, Step 2: New Password
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const inputRefs = useRef([])

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus()
        }
    }, [])

    const handleChange = (index, value) => {
        if (value.length > 1) {
            value = value[0]
        }

        if (!/^\d*$/.test(value)) {
            return
        }

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").slice(0, 6)
        
        if (!/^\d+$/.test(pastedData)) {
            return
        }

        const newOtp = [...otp]
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i]
        }
        setOtp(newOtp)

        const lastFilledIndex = Math.min(pastedData.length - 1, 5)
        inputRefs.current[lastFilledIndex]?.focus()
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        
        const otpString = otp.join("")
        
        if (otpString.length !== 6) {
            toast.error("Please enter all 6 digits")
            return
        }

        try {
            setIsLoading(true)
            const res = await axios.post(
                `http://localhost:8000/user/verify-otp/${email}`,
                { otp: otpString },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            
            if (res.data.success) {
                setStep(2)
                toast.success("OTP verified successfully!")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Invalid OTP")
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        
        if (!newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (newPassword.length < 4) {
            toast.error("Password must be at least 4 characters")
            return
        }

        try {
            setIsLoading(true)
            const res = await axios.post(
                `http://localhost:8000/user/change-password/${email}`,
                { newPassword, confirmPassword },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            
            if (res.data.success) {
                toast.success("Password reset successfully!")
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to reset password")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-black'>
            <Card className='w-full max-w-md bg-white border-2 border-gray-200'>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl font-bold text-black'>
                        {step === 1 ? "Verify OTP" : "Create New Password"}
                    </CardTitle>
                    <CardDescription className='text-gray-600'>
                        {step === 1 
                            ? `Enter the 6-digit code sent to ${email}`
                            : "Enter your new password"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 ? (
                        <form onSubmit={handleVerifyOtp} className='space-y-6'>
                            <div className='space-y-2'>
                                <Label className='text-black'>Verification Code</Label>
                                <div className='flex gap-2 justify-center'>
                                    {otp.map((digit, index) => (
                                        <Input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type='text'
                                            inputMode='numeric'
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={handlePaste}
                                            className='w-12 h-12 text-center text-lg font-semibold border-gray-300 focus:border-black focus:ring-black'
                                            disabled={isLoading}
                                        />
                                    ))}
                                </div>
                            </div>

                            <Button 
                                type='submit' 
                                className='w-full bg-black hover:bg-gray-800 text-white'
                                disabled={isLoading || otp.join("").length !== 6}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Verifying...
                                    </>
                                ) : "Verify OTP"}
                            </Button>

                            <div className='text-center text-sm text-gray-600'>
                                Didn't receive the code?{' '}
                                <button 
                                    type='button'
                                    onClick={() => navigate('/forgot-password')}
                                    className='text-black font-semibold hover:underline'
                                >
                                    Resend
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordReset} className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='newPassword' className='text-black'>New Password</Label>
                                <div className='relative'>
                                    <Input 
                                        id='newPassword' 
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='••••••••'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className='border-gray-300 focus:border-black focus:ring-black pr-10'
                                        disabled={isLoading}
                                    />
                                    <button 
                                        type='button' 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute text-gray-400 right-3 top-1/2 -translate-y-1/2 hover:text-gray-600'
                                    >
                                        {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                                    </button>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='confirmPassword' className='text-black'>Confirm Password</Label>
                                <div className='relative'>
                                    <Input 
                                        id='confirmPassword' 
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder='••••••••'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className='border-gray-300 focus:border-black focus:ring-black pr-10'
                                        disabled={isLoading}
                                    />
                                    <button 
                                        type='button' 
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className='absolute text-gray-400 right-3 top-1/2 -translate-y-1/2 hover:text-gray-600'
                                    >
                                        {showConfirmPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                                    </button>
                                </div>
                            </div>

                            <Button 
                                type='submit' 
                                className='w-full bg-black hover:bg-gray-800 text-white'
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Resetting...
                                    </>
                                ) : "Reset Password"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default VerifyOtp
