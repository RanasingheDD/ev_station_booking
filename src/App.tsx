import { useState } from 'react';
import EVHubDashboard from './components/dashboard/EVHubDashboard';
import EVRegistration from './components/login/Registration';

const App: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <>     
      <EVRegistration />
    </>
  );
};

export default App;
