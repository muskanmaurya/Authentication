import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const navigate=useNavigate();
  const [showPassword, setShowPassword]=useState(false);
  const[isLoading,setIsLoading]=useState(false);

  const [formData,setFormData]=useState({
    username:"",
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
      const res=await axios.post(`http://localhost:8000/user/register`,formData,{
        headers:{
          "Content-Type":"application/json"
        }
      })
      
      if(res.data.success){
        navigate('/verify-success')
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Registration failed')
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-black'>
      <Card className='w-full max-w-md bg-white border-2 border-gray-200'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-black'>Create an account</CardTitle>
          <CardDescription className='text-gray-600'>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name' className='text-black'>Full Name</Label>
              <Input 
                id='name' 
                type='text' 
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder='John Doe'
                className='border-gray-300 focus:border-black focus:ring-black'
              />
            </div>
            
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder='••••••••'
                className='border-gray-300 focus:border-black focus:ring-black pr-10'
                disabled={isLoading}
                />
                <button type='button' onClick={()=>setShowPassword(!showPassword)} className='absolute text-gray-400 right-3 top-1/2 -translate-y-1/2 hover:text-gray-600'>
                   {
                    showPassword?<EyeOff className='w-4 h-4'/>:<Eye className='w-4 h-4'/> 
                  }
                </button>
                </div>
            </div>
            
        
            
            <Button 
              type='submit' 
              className='w-full bg-black hover:bg-gray-800 text-white'
            >
              {
                isLoading?(
                  <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                  Creating account...
                  </>
                ):"Sign Up"
              }
            </Button>
            
            <div className='text-center text-sm text-gray-600'>
              Already have an account?{' '}
              <a href='/login' className='text-black font-semibold hover:underline'>
                Log in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUp