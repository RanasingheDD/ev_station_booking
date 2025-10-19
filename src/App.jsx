import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import EVHubDashboard from './components/dashboard/EVHubDashboard'
import EVAuth from './components/login/EVAuth'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>     
      <EVAuth/>
    </>
  )
}

export default App
