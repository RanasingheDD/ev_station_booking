import { useState } from 'react';
import EVHubDashboard from './components/dashboard/EVHubDashboard';
import EVAuth from './components/Registration/Registration';
import TopHome from './components/home/topHome';
import Navbar from './components/navbar/navbar';

const App: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <>     
      {/* <EVHubDashboard /> */}
      {/* <EVAuth/> */}
      <Navbar/>
      <TopHome/>
    </>
  );
};

export default App;
