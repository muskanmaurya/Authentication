import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import VerifyEmail from './pages/VerifyEmail'
import Verify from './pages/Verify'
import TokenVerify from './pages/TokenVerify'
import Navbar from './components/Navbar'
import ProtectedRoutes from './components/protectedRoutes.jsx'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOtp from './pages/VerifyOtp'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<ProtectedRoutes><Navbar/> <Home /></ProtectedRoutes>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/verify' element={<TokenVerify />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/verify-success' element={<Verify />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-otp/:email' element={<VerifyOtp />} />
      </Routes>
    </>
  )
}

export default App