import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function PrivateRoute() {
  const { isAuthenticated } = useAuth()
  const hasToken = isAuthenticated || !!localStorage.getItem('acabou_mony_token')
  return hasToken ? <Outlet /> : <Navigate to="/login" replace />
}
