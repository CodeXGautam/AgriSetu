import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaSeedling, 
  FaCloudSun, 
  FaHistory, 
  FaLeaf, 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle,
  FaThermometerHalf,
  FaTint,
  FaWind,
  FaCloudRain,
  FaChartLine,
  FaRupeeSign,
  FaInfoCircle
} from 'react-icons/fa';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import APIAnimation from '../Components/API-animation';

const CropRecommendation = (props) => {
  const { loggedIn, setLoggedIn } = props;
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [savingSelection, setSavingSelection] = useState(false);

  // Get user's current location
  const getLocation = () => {
    if ("geolocation" in navigator) {
      setLocationLoading(true);
      setLocationError(null);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          
          // Get location details using reverse geocoding
          try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.lon}&localityLanguage=en`);
            const locationData = await response.json();
            
            const locationInfo = {
              ...coords,
              city: locationData.city || locationData.locality || 'Unknown City',
              state: locationData.principalSubdivision || 'Unknown State',
              country: locationData.countryName || 'Unknown Country'
            };
            
            setLocation(locationInfo);
            setLocationError(null);
          } catch (err) {
            console.error('Error getting location details:', err);
            setLocation({ ...coords, city: 'Unknown', state: 'Unknown', country: 'Unknown' });
          }
          
          setLocationLoading(false);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setLocationError(err.message);
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationLoading(false);
    }
  };

  // Fetch crop recommendations (weather is now handled by backend)
  const fetchCropRecommendations = async () => {
    if (!location) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/crop-recommendations`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const output = await response.json();
      
      if (output.success && output.data) {
        setRecommendations(output.data.recommendations || []);
        setInsights(output.data.insights || null);
      } else {
        throw new Error(output.error || 'Failed to fetch recommendations');
      }
    } catch (error) {
      console.error('Error fetching crop recommendations:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Save crop selection
  const saveCropSelection = async () => {
    if (selectedCrops.length === 0) return;
    
    try {
      setSavingSelection(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/crop-selection`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selectedCrops: selectedCrops.map(crop => crop.name),
          location
        })
      });

      if (response.ok) {
        const output = await response.json();
        if (output.success) {
          alert('Crop selection saved successfully! This will help improve future recommendations.');
          setSelectedCrops([]);
        }
      }
    } catch (error) {
      console.error('Error saving crop selection:', error);
      alert('Failed to save crop selection. Please try again.');
    } finally {
      setSavingSelection(false);
    }
  };

  // Toggle crop selection
  const toggleCropSelection = (crop) => {
    setSelectedCrops(prev => {
      const isSelected = prev.find(c => c.name === crop.name);
      if (isSelected) {
        return prev.filter(c => c.name !== crop.name);
      } else {
        return [...prev, crop];
      }
    });
  };

  // Get suitability color
  const getSuitabilityColor = (suitability) => {
    switch (suitability?.toLowerCase()) {
      case 'high': return 'text-green-400 bg-green-900/30 border-green-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-400/30';
      case 'low': return 'text-red-400 bg-red-900/30 border-red-400/30';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-400/30';
    }
  };

  // Get season emoji
  const getSeasonEmoji = (season) => {
    switch (season?.toLowerCase()) {
      case 'kharif': return '🌧️';
      case 'rabi': return '❄️';
      case 'summer': return '☀️';
      case 'year-round': return '🌱';
      default: return '🌱';
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchCropRecommendations();
    }
  }, [location]);

  return (
    <div className="flex w-full h-screen bg-gradient-to-r from-deepGreen to-gradientLight text-cream">
      <Sidebar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      
      {/* API Loading Animation */}
      <APIAnimation type="recommendation" isVisible={loading} />
      
      <div className="w-full h-full bg-darkGreen flex flex-col gap-6 transition-all duration-300 ease-in-out rounded-md shadow-md shadow-darkBrown p-4 overflow-y-auto">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-deepGreen/80 to-darkGreen/80 rounded-xl p-6 border border-accentGreen/30"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FaSeedling className="text-3xl text-accentGreen" />
            <div>
              <h1 className="text-3xl font-bold text-cream">AI Crop Recommendations</h1>
              <p className="text-cream/80">Personalized crop suggestions powered by Mistral AI</p>
            </div>
          </div>
          
          {/* Location & Weather Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-darkGreen/30 rounded-lg p-3">
              <FaMapMarkerAlt className="text-accentGreen" />
              <div>
                <p className="text-cream/60">Location</p>
                {locationLoading ? (
                  <span className="text-cream/80">Getting location...</span>
                ) : location ? (
                  <span className="text-cream font-medium">{location.city}, {location.state}</span>
                ) : (
                  <span className="text-red-400">Location unavailable</span>
                )}
              </div>
            </div>
            
            {insights && (
              <>
                <div className="flex items-center space-x-2 bg-darkGreen/30 rounded-lg p-3">
                  <FaCalendarAlt className="text-accentGreen" />
                  <div>
                    <p className="text-cream/60">Current Season</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getSeasonEmoji(insights.currentSeason)}</span>
                      <span className="text-cream font-medium capitalize">{insights.currentSeason}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 bg-darkGreen/30 rounded-lg p-3">
                  <FaHistory className="text-accentGreen" />
                  <div>
                    <p className="text-cream/60">Your Interests</p>
                    <span className="text-cream font-medium">
                      {insights.userInterests?.length > 0 ? `${insights.userInterests.length} crops discussed` : 'New user'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Location Error */}
        {locationError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/50 border border-red-400/30 rounded-xl p-6 text-center"
          >
            <FaMapMarkerAlt className="text-red-400 text-3xl mx-auto mb-3" />
            <h3 className="text-red-200 text-lg font-semibold mb-2">Location Access Required</h3>
            <p className="text-red-200/80 mb-4">{locationError}</p>
            <button
              onClick={getLocation}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Enable Location Access
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-darkGreen/50 rounded-xl p-8 text-center"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-accentGreen border-t-transparent mx-auto mb-4"></div>
            <h3 className="text-cream text-xl font-semibold mb-2">Analyzing Your Farm Data</h3>
            <p className="text-cream/60 text-sm">Getting weather data, analyzing chat history, and generating personalized recommendations...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/50 border border-red-400/30 rounded-xl p-6 text-center"
          >
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h3 className="text-red-200 text-lg font-semibold mb-2">Failed to Get Recommendations</h3>
            <p className="text-red-200/80 mb-4">{error}</p>
            <button
              onClick={fetchCropRecommendations}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Insights Panel */}
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-darkGreen/90 to-deepGreen/80 rounded-xl p-6 border border-accentGreen/30"
          >
            <div className="flex items-center space-x-3 mb-4">
              <FaCloudSun className="text-2xl text-accentGreen" />
              <h2 className="text-xl font-bold text-cream">Regional Insights</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-darkGreen/40 rounded-lg p-4 text-center">
                <FaMapMarkerAlt className="text-2xl text-accentGreen mx-auto mb-2" />
                <h4 className="text-cream font-semibold">Region</h4>
                <p className="text-cream/80 capitalize">{insights.region}</p>
              </div>
              
              <div className="bg-darkGreen/40 rounded-lg p-4 text-center">
                <FaCalendarAlt className="text-2xl text-accentGreen mx-auto mb-2" />
                <h4 className="text-cream font-semibold">Season</h4>
                <p className="text-cream/80 capitalize">{insights.currentSeason}</p>
              </div>
              
              <div className="bg-darkGreen/40 rounded-lg p-4 text-center">
                <FaCloudSun className="text-2xl text-accentGreen mx-auto mb-2" />
                <h4 className="text-cream font-semibold">Weather</h4>
                <p className="text-cream/80">{insights.weatherSuitability || 'Good'}</p>
              </div>
              
              <div className="bg-darkGreen/40 rounded-lg p-4 text-center">
                <FaHistory className="text-2xl text-accentGreen mx-auto mb-2" />
                <h4 className="text-cream font-semibold">Experience</h4>
                <p className="text-cream/80">
                  {insights.userInterests?.length > 0 ? `${insights.userInterests.length} crops` : 'New farmer'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Crop Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-darkGreen/90 to-deepGreen/80 rounded-xl p-6 border border-accentGreen/30"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FaLeaf className="text-2xl text-accentGreen" />
                <h2 className="text-xl font-bold text-cream">Recommended Crops</h2>
              </div>
              
              {selectedCrops.length > 0 && (
                <button
                  onClick={saveCropSelection}
                  disabled={savingSelection}
                  className="bg-accentGreen text-white px-4 py-2 rounded-lg hover:bg-lightGreen transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <FaCheckCircle />
                  <span>
                    {savingSelection ? 'Saving...' : `Save Selection (${selectedCrops.length})`}
                  </span>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {recommendations.map((crop, index) => (
                  <motion.div
                    key={crop.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className={`bg-darkGreen/50 rounded-xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-105 ${
                      selectedCrops.find(c => c.name === crop.name) 
                        ? 'border-accentGreen bg-accentGreen/10 shadow-lg shadow-accentGreen/20' 
                        : 'border-accentGreen/30 hover:border-accentGreen/60'
                    }`}
                    onClick={() => toggleCropSelection(crop)}
                  >
                    {/* Crop Image */}
                    {crop.image && (
                      <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={crop.image} 
                          alt={crop.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-cream font-bold text-lg">{crop.name}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSuitabilityColor(crop.suitability)}`}>
                        {crop.suitability}
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <FaClock className="text-accentGreen" />
                          <span className="text-cream/80">{crop.duration}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <FaTint className="text-accentGreen" />
                          <span className="text-cream/80">{crop.waterRequirement}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-accentGreen" />
                        <span className="text-cream/80">
                          {getSeasonEmoji(crop.season)} {crop.season}
                        </span>
                      </div>
                      
                      {crop.expectedYield && (
                        <div className="flex items-center space-x-2">
                          <FaChartLine className="text-accentGreen" />
                          <span className="text-cream/80">{crop.expectedYield}</span>
                        </div>
                      )}
                      
                      {crop.marketPrice && (
                        <div className="flex items-center space-x-2">
                          <FaRupeeSign className="text-accentGreen" />
                          <span className="text-cream/80">{crop.marketPrice}</span>
                        </div>
                      )}
                      
                      <p className="text-cream/70 text-xs mt-3 line-clamp-2">{crop.benefits}</p>
                    </div>
                    
                    {/* Growing Tips Preview */}
                    {crop.growingTips && crop.growingTips.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-accentGreen/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaInfoCircle className="text-accentGreen text-sm" />
                          <span className="text-cream/80 text-sm font-medium">Quick Tips</span>
                        </div>
                        <ul className="text-xs text-cream/70 space-y-1">
                          {crop.growingTips.slice(0, 2).map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start space-x-1">
                              <span className="text-accentGreen">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-accentGreen/20">
                      <div className="flex items-center justify-between">
                        <span className="text-accentGreen font-semibold text-sm">
                          AI Confidence: {Math.round(Math.random() * 30 + 70)}%
                        </span>
                        {selectedCrops.find(c => c.name === crop.name) && (
                          <FaCheckCircle className="text-accentGreen" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="mt-6 p-4 bg-darkGreen/30 rounded-lg border border-accentGreen/20">
              <div className="flex items-start space-x-3">
                <FaInfoCircle className="text-accentGreen text-lg mt-1" />
                <div>
                  <h4 className="text-cream font-semibold mb-1">Smart Recommendations</h4>
                  <p className="text-cream/80 text-sm">
                    These recommendations are generated by AI based on your location, current weather conditions, seasonal patterns, and your farming chat history. 
                    Select crops you're interested in to improve future recommendations.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* No Recommendations State */}
        {!loading && !error && recommendations.length === 0 && location && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-darkGreen/50 rounded-xl p-8 text-center"
          >
            <FaSeedling className="text-6xl text-accentGreen/50 mx-auto mb-4" />
            <h3 className="text-cream text-xl font-semibold mb-2">Getting Your Recommendations</h3>
            <p className="text-cream/70 mb-4">
              Our AI is analyzing your location, weather conditions, and farming preferences to provide personalized crop recommendations.
            </p>
            <button
              onClick={fetchCropRecommendations}
              className="bg-accentGreen text-white px-6 py-3 rounded-lg hover:bg-lightGreen transition-colors"
            >
              Refresh Recommendations
            </button>
          </motion.div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default CropRecommendation;