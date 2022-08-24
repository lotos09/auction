import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/adminPanel/navigation/AppRouter';
import { useContext } from 'react';
import { Context } from './index';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Loader } from './untils/Loader';

function App() {
  const { auth } = useContext(Context);
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <Loader />;
  }
  
  //misha xuy ebaniy ya perdoly

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
