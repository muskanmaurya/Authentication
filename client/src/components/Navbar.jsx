import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookA, BookOpen, LogOut, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useUser } from '@/context/userContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'sonner'
import axios from 'axios'

const Navbar = () => {
    const { user, setUser } = useUser()
    const navigate = useNavigate()
    const accessToken = localStorage.getItem("accessToken")

    const logoutHandler = async () => { 
        try {
            const res = await axios.post(
                `http://localhost:8000/user/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )
            if (res.data.success) {
                setUser({})
                localStorage.clear()
                toast.success(res.data.message)
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
            toast.error('Logout failed')
        }
    }
  return (
        <nav className='w-full bg-gray-900 text-white border-b border-white/10'>
            <div className='mx-auto max-w-6xl px-6 py-4 flex items-center justify-between'>
                <Link to='/' className='flex items-center gap-2'>
                    <BookOpen className='h-5 w-5 text-white' />
                    <span className='text-lg font-semibold tracking-tight'>NotesApp</span>
                </Link>
                <ul className='hidden md:flex items-center gap-6 text-sm text-white/80'>
                    <li className='hover:text-white transition'>Features</li>
                    <li className='hover:text-white transition'>Pricing</li>
                    <li className='hover:text-white transition'>About</li>
                    {
                      user?<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuItem><User/>Profile</DropdownMenuItem>
      <DropdownMenuItem><BookA/> Notes</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logoutHandler} ><LogOut/> Logout</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>:  <Link to='/login' className='text-sm text-white/80 hover:text-white transition'>
                        Log in
                    </Link>
                    }
                </ul>

            </div>
        </nav>
  )
}

export default Navbar