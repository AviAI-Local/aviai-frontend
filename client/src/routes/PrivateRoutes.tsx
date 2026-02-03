import { Navigate, Outlet } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'

export default function PrivateRoute() {
    const { user, loading } = useUserContext()

    if (loading) return <div>Loading...</div>

    return user ? <Outlet /> : <Navigate to='/auth' replace />
}
