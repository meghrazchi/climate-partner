import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import { ProtectedRoute } from './guards'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  // { path: '/dashboard', element: <Dashboard /> },
  {
    path: "/dashboard",
     element: <ProtectedRoute />, 
     children: [
      {
        index: true, // this means the default child of /dashboard
        element: <Dashboard />,
      },
    ],
  },
]);