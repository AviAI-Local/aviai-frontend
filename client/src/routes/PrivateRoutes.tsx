import { Navigate, Outlet } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import FullPageLoader from '../components/common/FullPageLoader'

export default function PrivateRoute() {
    const { user, loading } = useUserContext()

    // if (loading) return <div>Loading...</div>
    if (loading) return <FullPageLoader loading={loading} />

    return user ? <Outlet /> : <Navigate to='/auth' replace />
}
