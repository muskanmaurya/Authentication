import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Mail } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!email) {
            toast.error("Please enter your email")
            return
        }

        try {
            setIsLoading(true)
            const res = await axios.post(
                `http://localhost:8000/user/forgot-password`,
                { email },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            
            console.log("Response:", res.data)
            console.log("Email to navigate:", email)
            
            if (res.data.success) {
                toast.success(res.data.message)
                const encodedEmail = encodeURIComponent(email)
                console.log("Navigating to:", `/verify-otp/${encodedEmail}`)
                navigate(`/verify-otp/${encodedEmail}`)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to send OTP")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-black'>
            <Card className='w-full max-w-md bg-white border-2 border-gray-200'>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl font-bold text-black'>Reset Password</CardTitle>
                    <CardDescription className='text-gray-600'>
                        Enter your email address and we'll send you a verification code
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='email' className='text-black'>Email Address</Label>
                            <div className='relative'>
                                <Input 
                                    id='email' 
                                    type='email' 
                                    placeholder='john@example.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='border-gray-300 focus:border-black focus:ring-black pl-10'
                                    disabled={isLoading}
                                />
                                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                            </div>
                        </div>

                        <Button 
                            type='submit' 
                            className='w-full bg-black hover:bg-gray-800 text-white'
                            disabled={isLoading}
                        >
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Sending...
                                    </>
                                ) : "Send OTP"
                            }
                        </Button>

                        <div className='text-center text-sm text-gray-600'>
                            <a href='/login' className='text-black font-semibold hover:underline'>
                                Back to Login
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default ForgotPassword

