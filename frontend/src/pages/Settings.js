


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import Sidebar from '../Components/Sidebar';
import toast, { Toaster } from 'react-hot-toast';

const Settings = (props) => {
  // Example user info state
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    phone: '',
    location: '',
    avatar: ''
  });
  // Fetch user info from backend
  useEffect(() => {
        const fetchUserInfo = async () => {
        try {
            const res = await fetch(process.env.REACT_APP_BACKEND_URI + '/getUser', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
            const user = data.user;

            setUserInfo({
                username: user.firstname,
                email: user.email,
                image: user.avatar,
                phone: user.phone || '',
                location: user.location || '',
            })

        } catch (error) {
            console.log("Error: ", error);
        }
    }
    fetchUserInfo();
  }, []);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Check if username is not empty
    if (!userInfo.username || userInfo.username.trim() === '') {
      toast.error('Name is required');
      setLoading(false);
      return;
    }
    
    try {
      const payload = {
        firstname: userInfo.username,
        phone: userInfo.phone,
        location: userInfo.location,
      };
      console.log('Sending update with payload:', payload);
      
      const res = await fetch(process.env.REACT_APP_BACKEND_URI + '/user/update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.user) {
        setUserInfo({
          username: data.user.firstname || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          location: data.user.location || '',
          avatar: data.user.avatar || '',
        });
        toast.success('Information updated successfully!');
        setEditMode(false);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Update failed');
    }
    setLoading(false);
  };

  // Handle logout
  const handleLogout = async () => {
    const loadingToast = toast.loading('Logging out...');
    try {
      const res = await fetch(process.env.REACT_APP_BACKEND_URI + '/logout', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await res.json();
      toast.dismiss(loadingToast);
      
      if (res.ok) {
        toast.success('Logged out successfully');
        // Short delay to show the success message before redirecting
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-deepGreen to-gradientLight text-cream">
      <Sidebar {...props} />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="w-full rounded-xl bg-gradient-to-br from-darkGreen/80 via-accentGreen/10 to-lightGreen/10 shadow-lg border border-accentGreen/20 px-0 sm:px-2 py-2 sm:py-6 mb-6">
            {/* Profile Header - full width */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between px-4 sm:px-12 pt-8 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accentGreen to-lightGreen shadow-lg flex items-center justify-center overflow-hidden">
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <FaUserCircle className="text-4xl text-darkGreen" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-lg text-cream">{userInfo.username}</div>
                  <div className="text-cream/80 text-sm">{userInfo.email}</div>
                </div>
              </div>
              <button
                className="text-cream/60 hover:text-accentGreen text-xl mt-4 sm:mt-0"
                onClick={() => setEditMode(!editMode)}
                title="Edit"
              >
                <FaEdit />
              </button>
            </div>

            {/* Info Section - full width */}
            <form onSubmit={handleSubmit} className="w-full px-4 sm:px-12 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                <div className="flex flex-col gap-2">
                  <span className="text-cream/70">Name</span>
                  {editMode ? (
                    <input
                      type="text"
                      name="username"
                      value={userInfo.username}
                      onChange={handleChange}
                      className="bg-darkGreen/40 border-b border-accentGreen px-2 py-2 text-cream focus:outline-none w-full rounded"
                      required
                    />
                  ) : (
                    <span className="text-cream font-medium">{userInfo.username}</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-cream/70">Email account</span>
                  <span className="text-cream font-medium">{userInfo.email}</span>
                  {editMode && (
                    <span className="text-cream/50 text-xs italic">Email cannot be changed</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-cream/70">Mobile number</span>
                  {editMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={userInfo.phone}
                      onChange={handleChange}
                      className="bg-darkGreen/40 border-b border-accentGreen px-2 py-2 text-cream focus:outline-none w-full rounded"
                    />
                  ) : (
                    <span className="text-cream font-medium">{userInfo.phone || 'Add number'}</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-cream/70">Location</span>
                  {editMode ? (
                    <input
                      type="text"
                      name="location"
                      value={userInfo.location}
                      onChange={handleChange}
                      className="bg-darkGreen/40 border-b border-accentGreen px-2 py-2 text-cream focus:outline-none w-full rounded"
                    />
                  ) : (
                    <span className="text-cream font-medium">{userInfo.location}</span>
                  )}
                </div>
              </div>
              {editMode && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-1/2 mt-8 bg-accentGreen text-white font-bold py-2 rounded-lg shadow-md hover:bg-lightGreen transition-colors duration-200 disabled:opacity-50 text-base"
                >
                  {loading ? 'Saving...' : 'Save Change'}
                </motion.button>
              )}
            </form>
            <Toaster
              position="top-right"
              toastOptions={{
                success: {
                  style: {
                    background: '#165B3A',
                    color: '#fff',
                  },
                },
                error: {
                  style: {
                    background: '#8B0000',
                    color: '#fff',
                  },
                },
                duration: 3000,
              }}
            />
          </div>

          {/* Logout Button - full width, aligned and darker red */}
          <div className="w-full flex justify-end px-4 sm:px-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="w-full sm:w-1/3 bg-[#8B0000] text-white font-bold py-2 rounded-lg shadow-md hover:bg-[#a30000] transition-colors duration-200 text-base mb-6"
              style={{maxWidth: '220px'}}>
              Log Out
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
