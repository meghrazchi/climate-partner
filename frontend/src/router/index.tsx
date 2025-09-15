import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import { ProtectedRoute } from './guards'

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <ProtectedRoute />,        // anything below requires auth
    children: [
      { path: '/dashboard', element: <Dashboard /> },
    ],
  },
])
