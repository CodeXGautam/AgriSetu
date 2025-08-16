import { Routes, Route } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, Suspense, lazy } from 'react';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import Market from './pages/Market';
import Checkout from './pages/Checkout';
import CropRecommendation from './pages/CropRecommendation';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Lazy load components
const AgriNews = lazy(() => import('./pages/AgriNews'));
const AIChatbot = lazy(() => import('./pages/AIChatbot'));
const DiseaseDetection = lazy(() => import('./pages/DiseaseDetection'));

// Loading component with the same animation style
const LoadingAnimation = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="min-h-screen bg-gradient-to-r from-deepGreen to-gradientLight flex items-center justify-center"
  >
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </motion.div>
);

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
    <div className="bg-gradient-to-b from-green-300 via-yellow-100 to-green-300 min-h-screen flex flex-col relative">
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
          {loggedIn && (
            <Route path='/agri-news' element={
              <motion.div
                key="agri-news"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<LoadingAnimation />}>
                  <AgriNews />
                </Suspense>
              </motion.div>
            } />
          )}
          {loggedIn && (
            <Route path='/ai-chatbot' element={
              <motion.div
                key="ai-chatbot"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<LoadingAnimation />}>
                  <AIChatbot loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                </Suspense>
              </motion.div>
            } />
          )}
          {loggedIn && (
            <Route path='/disease-detection' element={
              <motion.div
                key="disease-detection"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<LoadingAnimation />}>
                  <DiseaseDetection />
                </Suspense>
              </motion.div>
            } />
          )}
          {loggedIn && (
            <Route path='/marketplace' element={
              <motion.div
                key="marketplace"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<LoadingAnimation />}>
                  <Market />
                </Suspense>
              </motion.div>
            } />
          )}
          {loggedIn && (
            <Route path='/cart' element={
              <motion.div
                key="cart"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<LoadingAnimation />}>
                  <Checkout/>
                </Suspense>
              </motion.div>
            } />
          )}
          {loggedIn && (
            <Route path='/crops-prediction' element={
              <motion.div
                key="crop-recommendation"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<LoadingAnimation />}>
                  <CropRecommendation/>
                </Suspense>
              </motion.div>
            } />
          )}
          {loggedIn && (
            <Route path='/analytics' element={
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<LoadingAnimation />}>
                  <Analytics/>
                </Suspense>
              </motion.div>
            } />
          )}
          {loggedIn && (
            <Route path='/settings' element={
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<LoadingAnimation />}>
                  <Settings/>
                </Suspense>
              </motion.div>
            } />
          )}
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
