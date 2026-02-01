import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

const Verify = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-black'>
      <Card className='w-full max-w-md bg-white border-2 border-gray-200'>
        <CardContent className='pt-6'>
          <div className='flex flex-col items-center text-center space-y-4'>
            <div className='w-16 h-16 bg-black rounded-full flex items-center justify-center'>
              <CheckCircle2 className='w-10 h-10 text-white' />
            </div>
            
            <CardTitle className='text-2xl font-bold text-black'>
              Check Your Email
            </CardTitle>
            
            <CardDescription className='text-gray-600 text-base'>
              We've sent you an email to verify your account. Please check your inbox and click the verification link.
            </CardDescription>

            <div className='pt-2'>
              <a href='/login' className='text-sm text-black font-semibold hover:underline'>
                Back to Login
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Verify