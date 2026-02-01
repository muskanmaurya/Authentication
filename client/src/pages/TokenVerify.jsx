import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const TokenVerify = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setStatus('error')
        setMessage('Verification token is missing')
        return
      }

      try {
        const res = await axios.post(
          'http://localhost:8000/user/verify',
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (res.data.success) {
          setStatus('success')
          setMessage(res.data.message || 'Email verified successfully!')
          setTimeout(() => {
            navigate('/login')
          }, 3000)
        }
      } catch (error) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Verification failed')
      }
    }

    verifyToken()
  }, [searchParams, navigate])

  return (
    <div className='min-h-screen flex items-center justify-center bg-black'>
      <Card className='w-full max-w-md bg-white border-2 border-gray-200'>
        <CardContent className='pt-6'>
          <div className='flex flex-col items-center text-center space-y-4'>
            {status === 'loading' && (
              <>
                <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
                  <Loader2 className='w-10 h-10 text-black animate-spin' />
                </div>
                <CardTitle className='text-2xl font-bold text-black'>
                  Verifying...
                </CardTitle>
                <CardDescription className='text-gray-600 text-base'>
                  Please wait while we verify your email address
                </CardDescription>
              </>
            )}

            {status === 'success' && (
              <>
                <div className='w-16 h-16 bg-black rounded-full flex items-center justify-center'>
                  <CheckCircle2 className='w-10 h-10 text-white' />
                </div>
                <CardTitle className='text-2xl font-bold text-black'>
                  Email Verified!
                </CardTitle>
                <CardDescription className='text-gray-600 text-base'>
                  {message}
                </CardDescription>
                <p className='text-sm text-gray-600'>
                  Redirecting to login page...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className='w-16 h-16 bg-black rounded-full flex items-center justify-center'>
                  <XCircle className='w-10 h-10 text-white' />
                </div>
                <CardTitle className='text-2xl font-bold text-black'>
                  Verification Failed
                </CardTitle>
                <CardDescription className='text-gray-600 text-base'>
                  {message}
                </CardDescription>
                <div className='pt-2'>
                  <a href='/signup' className='text-sm text-black font-semibold hover:underline'>
                    Back to Sign Up
                  </a>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TokenVerify
