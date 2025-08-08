import { Routes, Route } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import LoadingAnimation from './Components/LoadingAnimation';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="bg-gradient-to-r from-deepGreen to-gradientLight min-h-screen flex flex-col relative">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path='/' element={
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            </motion.div>
          } />
          <Route path='/register' element={
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <RegisterPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            </motion.div>
          } />
          <Route path='/login' element={
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <LoginPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            </motion.div>
          } />
          {loggedIn && (
            <Route path='/home' element={
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Home loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
              </motion.div>
            } />
          )}
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
