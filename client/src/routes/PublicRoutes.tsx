import { Navigate, Outlet } from "react-router-dom"
import { useUserContext } from "../contexts/UserContext"

export default function PublicRoutes() {
  const { user, loading } = useUserContext()

  if (loading) {
    return <div>Loading...</div> 
  }

  if (user) {
    return <Navigate to="/usecases" replace />
  }

  return <Outlet />
}
