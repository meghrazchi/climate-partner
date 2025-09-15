import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export function ProtectedRoute() {
  const isAuthed = useAuthStore(s => s.isAuthenticated)
  return isAuthed ? <Outlet /> : <Navigate to="/login" replace />
}