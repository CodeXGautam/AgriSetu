import { Routes, Route} from 'react-router';
import LandingPage from './pages/LandingPage';
import { useState, useEffect } from 'react';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';


const App = () => {

  const [loggedIn, setLoggedIn] = useState(false);

  const refreshToken = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_BACKEND_URI + '/refresh-token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.message === "Token not found" || data.message === "Unauthorized user" || data.message === "Token expired or already used") {
        console.log(data.message);
        setLoggedIn(false);
        return;
      }
      if (data.message === "Access token refreshed") {
        console.log("access token refreshed");
        setLoggedIn(true);
      }
      else {
        console.log("Error: ", data.message)
      }

    } catch (err) {
      console.log("Refreshing token failed");
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);


  return (
    <div className="bg-gradient-to-r from-deepGreen to-gradientLight min-h-screen flex flex-col relative">

      <Routes>
        <Route path='/' element={<LandingPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
        <Route path='/register' element={<RegisterPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
        <Route path='/login' element={<LoginPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
        {
          loggedIn && 
          <Route path='/home' element={<Home loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
        }
      </Routes>

    </div>
  );
}

export default App;
