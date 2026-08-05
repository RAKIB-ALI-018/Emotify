import { createBrowserRouter } from 'react-router'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Landing from './features/auth/pages/Landing'
import Home from './features/home/pages/Home'

export const router = createBrowserRouter([
    { path: '/', element: <Landing /> },
    { path: '/register', element: <Register /> },
    { path: '/login', element: <Login /> },
    { path: '/home', element: <Home /> }
])