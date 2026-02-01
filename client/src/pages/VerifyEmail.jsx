import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const VerifyEmail = () => {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('OTP submitted:', otp)
  }

  const handleResend = () => {
    setResendLoading(true)
    console.log('Resending OTP...')
    setTimeout(() => {
      setResendLoading(false)
    }, 1000)
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-black'>
      <Card className='w-full max-w-md bg-white border-2 border-gray-200'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-black'>Verify your email</CardTitle>
          <CardDescription className='text-gray-600'>
            Enter the verification code sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='otp' className='text-black'>Verification Code</Label>
              <Input 
                id='otp' 
                type='text' 
                placeholder='Enter 6-digit code'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength='6'
                className='border-gray-300 focus:border-black focus:ring-black text-center text-lg tracking-widest'
                disabled={isLoading}
              />
            </div>

            <div className='text-sm text-gray-600'>
              <p>Didn't receive the code?{' '}
                <button
                  type='button'
                  onClick={handleResend}
                  disabled={resendLoading}
                  className='text-black font-semibold hover:underline disabled:opacity-50'
                >
                  {resendLoading ? 'Resending...' : 'Resend'}
                </button>
              </p>
            </div>

            <Button 
              type='submit' 
              className='w-full bg-black hover:bg-gray-800 text-white'
              disabled={isLoading || otp.length !== 6}
            >
              {
                isLoading?(
                  <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                  Verifying...
                  </>
                ):"Verify Email"
              }
            </Button>

            <div className='text-center text-sm text-gray-600'>
              <a href='/signup' className='text-black font-semibold hover:underline'>
                Back to Sign Up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmail