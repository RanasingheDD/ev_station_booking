import { useState } from 'react';
import EVHubDashboard from './components/dashboard/EVHubDashboard';
import EVRegistration from './components/login/login';
import Navbar from './components/navbar/navbar';
import TopHome from './components/home/topHome';


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
