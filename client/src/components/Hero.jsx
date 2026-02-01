import { Button } from '@/components/ui/button'
import { Navigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useUser } from '@/context/userContext'

const Hero = () => {
	const {user}=useUser();
	return (
		<section className='min-h-[70vh] w-full bg-black text-white flex items-center justify-center px-6 py-16'>
			<div className='max-w-3xl text-center space-y-6'>
				<h1 className='text-3xl font-bold'>Welcome back, {user.username}</h1>
				<div className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/80'>
					New • Secure Authentication
				</div>
				<h1 className='text-3xl sm:text-4xl md:text-5xl font-bold leading-tight'>
					Your access, organized and secure everywhere
				</h1>
				<p className='text-sm sm:text-base text-white/70 max-w-2xl mx-auto'>
					Build trust with a clean, modern authentication flow. Fast, simple, and protected—
					so your users can focus on what matters.
				</p>
				<div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
					<Button onClick={()=>Navigate('/create-todo')} className='bg-white text-black hover:bg-gray-400'>Get Started
                        <ArrowRight className='h-3 w-4'/>
                    </Button>
					<Button variant='outline' className='border-white/40 text-black hover:bg-gray-400'>
						Watch Demo
					</Button>
				</div>
				<p className='text-xs text-white/50'>
					Free forever • No credit card required • 2-minute setup
				</p>
			</div>
		</section>
	)
}

export default Hero
