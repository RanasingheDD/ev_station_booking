import React from 'react';
// import EVHubDashboard from './components/dashboard/EVHubDashboard';
// import EVRegistration from './components/login/login';
import Navbar from './components/navbar/navbar'
import TopHome from './components/home/topHome'
//import AboutUs from './components/home/about'
import VideoWithStorySection from './components/home/VideoWithStorySection';


const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <TopHome />
      <VideoWithStorySection/>
      {/* <AboutUs /> */}
      {/* <Footer /> */}
    </>
  )
}

export default App;
