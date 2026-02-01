import { useUser } from '@/context/userContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {
    const { user } = useUser()
    
    return user && Object.keys(user).length > 0 ? children : <Navigate to="/login" />
}

export default ProtectedRoutes