import React from 'react'
import Navbar from './components/navbar/navbar'
import TopHome from './components/home/topHome'
import AboutUs from './components/home/about'
import Footer from './components/footer/footer'

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <TopHome />
      <AboutUs />
      <Footer />
    </>
  )
}

export default App
