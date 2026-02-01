import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import {  useUser } from '@/context/userContext'


const Login = () => {
  const {setUser}=useUser();
 const navigate=useNavigate();
  const [showPassword, setShowPassword]=useState(false);
  const[isLoading,setIsLoading]=useState(false);

  const [formData,setFormData]=useState({
    email:"",
    password:""
  })
  
  const handleChange=(e)=>{
    const{name,value}=e.target;
    setFormData((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    console.log(formData)

    try {
      setIsLoading(true)
      const res=await axios.post(`http://localhost:8000/user/login`,formData,{
        headers:{
          "Content-Type":"application/json"
        }
      })
      
      if(res.data.success){
        navigate('/')
        setUser(res.data.user)
        localStorage.setItem('accessToken',res.data.accessToken)
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Login failed')
    }finally{
      setIsLoading(false)
    }
  }
    return (
    <div className='min-h-screen flex items-center justify-center bg-black'>
      <Card className='w-full max-w-md bg-white border-2 border-gray-200'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-black'>Welcome back</CardTitle>
          <CardDescription className='text-gray-600'>
            Enter your credentials to log in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-black'>Email</Label>
              <Input 
                id='email' 
                type='email' 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder='john@example.com'
                className='border-gray-300 focus:border-black focus:ring-black'
              />
            </div>
            
            <div className='space-y-2'>
              <Label htmlFor='password' className='text-black'>Password</Label>
              <div className='relative'> 
              <Input 
                id='password' 
                type={showPassword ? 'text' : 'password'} 
                placeholder='••••••••'
                name="password"
                value={formData.password}
                onChange={handleChange}
                className='border-gray-300 focus:border-black focus:ring-black pr-10'
                />
                <button type='button' onClick={()=>setShowPassword(!showPassword)} className='absolute text-gray-400 right-3 top-1/2 -translate-y-1/2 hover:text-gray-600'>
                  {showPassword ? <EyeOff className='w-4 h-4'/> : <Eye className='w-4 h-4'/>}
                </button>
                </div>
            </div>
            
            <div className='flex items-center justify-between text-sm'>
              <label className='flex items-center space-x-2'>
                <input type='checkbox' className='w-4 h-4 border-gray-300' />
                <span className='text-gray-600'>Remember me</span>
              </label>
              <a href='/forgot-password' className='text-black font-semibold hover:underline'>
                Forgot password?
              </a>
            </div>
            
            <Button 
              type='submit' 
              className='w-full bg-black hover:bg-gray-800 text-white'
            >
              {
                isLoading?(
                  <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                  Logging into your account...
                  </>
                ):"Login"
              }
            </Button>
            
            <div className='text-center text-sm text-gray-600'>
              Don't have an account?{' '}
              <a href='/signup' className='text-black font-semibold hover:underline'>
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login