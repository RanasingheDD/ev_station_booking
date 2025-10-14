import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import EVHubDashboard from './components/home/stations/EVHubDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <EVHubDashboard/>
    </>
  )
}

export default App
