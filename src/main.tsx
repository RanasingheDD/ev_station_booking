import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import { createBrowserRouter, Navigate, RouterProvider,} from 'react-router-dom'

// Public pages
import App from './App'
//import AboutUs from './components/home/about'
// import Partners from './pages/Partners'
// import ContactUs from './pages/ContactUs'
import SignUp from './components/Registration/Registration'
import Login from './components/login/login'

// Private pages
import Dashboard from './components/pages/EVHubDashboard'
import Stations from './components/pages/EVHubStations'
import Layout from './components/Layout/SideBarLayout'
import Account from './components/pages/EVHubAccount'


//PrivateRoute Component
const PrivateRoute = ({ element }: { element: React.ReactElement }) => {
  const isAuthenticated = localStorage.getItem('auth') === 'true'
  return isAuthenticated ? element : <Navigate to="/login" replace />
}

// Router
const router = createBrowserRouter([
  // Public
  { path: '/', element: <App /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <Login /> },
  

  // Private routes wrapped in Layout
  {
    path: '/',
    element: <PrivateRoute element={<Layout />} />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'stations', element: <Stations /> },
      { path: '/account', element: <Account /> },
      // Add more private pages here
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
