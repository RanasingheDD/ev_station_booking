import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

// Import main app and pages
import App from './App'
// import AboutUs from './pages/AboutUs'
// import Partners from './pages/Partners'
// import ContactUs from './pages/ContactUs'
import SignUp from './components/Registration/Registration'
import Login from './components/login/login'
import Dashboard from './components/dashboard/EVHubDashboard'
// import AboutUs from './components/home/about'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  // {
  //   path: '/about',
  //   element: <AboutUs />,
  // },
  // {
  //   path: '/partners',
  //   element: <Partners />,
  // },
  // {
  //   path: '/contact',
  //   element: <ContactUs />,
  // },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element:<Dashboard/>
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
