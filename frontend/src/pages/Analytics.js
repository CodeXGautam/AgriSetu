import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiBarChart2, 
  FiPieChart, 
  FiMapPin, 
  FiDollarSign,
  FiAlertTriangle,
  FiInfo,
  FiRefreshCw,
  FiActivity,
  FiArrowLeft
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import APIAnimation from '../Components/API-animation';

const Analytics = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [trendData, setTrendData] = useState(null);
  const [loadingTrends, setLoadingTrends] = useState(false);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          
          // Get location name
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            setLocationName(`${data.city || data.locality || 'Unknown'}, ${data.principalSubdivision || data.countryName}`);
          } catch (error) {
            console.error('Error getting location name:', error);
            setLocationName('Location detected');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Please enable location services.');
        }
      );
    }
  }, []);

  // Fetch analytics data
  const fetchAnalytics = async () => {
    if (!location) {
      toast.error('Location not available');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/analytics/crop-pricing`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: location
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.data);
        toast.success('Analytics data loaded successfully!');
      } else {
        throw new Error('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed crop trends
  const fetchCropTrends = async (cropName) => {
    if (!location || !cropName) return;

    setLoadingTrends(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/analytics/crop-trends`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: location,
          cropName
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTrendData(data.data);
        toast.success(`Detailed trends for ${cropName} loaded!`);
      } else {
        throw new Error('Failed to fetch trend data');
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
      toast.error('Failed to load trend data');
    } finally {
      setLoadingTrends(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'text-green-800 bg-green-400/80';
      case 'medium': return 'text-yellow-800 bg-yellow-400/80';
      case 'high': return 'text-red-800 bg-red-400/80';
      default: return 'text-gray-800 bg-gray-400/80';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend?.toLowerCase().includes('increasing') || trend?.toLowerCase().includes('rising')) {
      return <FiTrendingUp className="text-green-600" />;
    } else if (trend?.toLowerCase().includes('decreasing') || trend?.toLowerCase().includes('falling')) {
      return <FiTrendingDown className="text-red-600" />;
    }
    return <FiBarChart2 className="text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-deepGreen to-gradientLight text-cream">
      {/* API Loading Animation */}
      <APIAnimation type="analytics" isVisible={loading || loadingTrends} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-deepGreen/80 to-darkGreen/80 rounded-xl p-4 sm:p-6 border border-accentGreen/30 mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-cream/80 hover:text-cream transition-colors bg-darkGreen/30 px-3 py-2 rounded-lg"
            >
              <FiArrowLeft className="mr-2" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <FiDollarSign className="text-3xl text-accentGreen" />
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cream">
                  Market Price Analytics
                </h1>
                <p className="text-cream/80 text-sm sm:text-base">
                  Real-time crop pricing and profitability analysis for your region
                </p>
              </div>
            </div>
            {locationName && (
              <div className="items-center justify-center mt-2 text-sm text-cream/60 bg-darkGreen/30 rounded-lg px-3 py-2 inline-flex">
                <FiMapPin className="mr-2 text-accentGreen" />
                {locationName}
              </div>
            )}
          </div>
        </motion.div>

        {/* Load Analytics Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6 sm:mb-8"
        >
          <button
            onClick={fetchAnalytics}
            disabled={loading || !location}
            className="bg-gradient-to-r from-accentGreen to-accentGreen/80 hover:from-accentGreen/90 hover:to-accentGreen/70 disabled:from-gray-500 disabled:to-gray-400 text-darkGreen disabled:text-gray-300 px-6 sm:px-8 py-3 rounded-lg font-semibold flex items-center mx-auto transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {loading ? (
              <FiRefreshCw className="animate-spin mr-2" />
            ) : (
              <FiBarChart2 className="mr-2" />
            )}
            <span className="text-sm sm:text-base">
              {loading ? 'Loading Price Data...' : 'Analyze Market Prices'}
            </span>
          </button>
        </motion.div>

        {/* Analytics Dashboard */}
        {analyticsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Price Overview */}
            <div className="bg-gradient-to-r from-darkGreen/80 to-deepGreen/80 rounded-xl shadow-lg p-4 sm:p-6 border border-accentGreen/30">
              <h2 className="text-xl sm:text-2xl font-bold text-cream mb-4 flex items-center">
                <FiDollarSign className="mr-2 text-accentGreen" />
                Market Price Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accentGreen/20 p-4 rounded-lg border border-accentGreen/30">
                  <h3 className="font-semibold text-accentGreen mb-2">Market Trend</h3>
                  <p className="text-cream/80 text-sm">{analyticsData.marketOutlook}</p>
                </div>
                <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-400/30">
                  <h3 className="font-semibold text-blue-300 mb-2">Price Impact</h3>
                  <p className="text-cream/80 text-sm">{analyticsData.weatherImpact}</p>
                </div>
                <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-400/30">
                  <h3 className="font-semibold text-purple-300 mb-2">Region</h3>
                  <p className="text-cream/80 text-sm">{analyticsData.region}</p>
                </div>
              </div>
            </div>

            {/* Profitability Analysis */}
            <div className="bg-gradient-to-r from-darkGreen/80 to-deepGreen/80 rounded-xl shadow-lg p-4 sm:p-6 border border-accentGreen/30">
              <h2 className="text-xl sm:text-2xl font-bold text-cream mb-4 flex items-center">
                <FiActivity className="mr-2 text-accentGreen" />
                Crop Profitability Rankings
              </h2>
              <p className="text-cream/70 mb-6 text-sm sm:text-base">Based on current market prices, demand trends, and cultivation costs in your area</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {analyticsData.crops?.map((crop, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-darkGreen/40 border border-accentGreen/30 rounded-lg p-4 hover:bg-darkGreen/60 hover:border-accentGreen/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-accentGreen/20 transform hover:scale-105"
                    onClick={() => {
                      setSelectedCrop(crop.name);
                      fetchCropTrends(crop.name);
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-cream">{crop.name}</h3>
                      <div className="text-xl">{getTrendIcon(crop.priceTrend)}</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-cream/70 text-sm">Market Price:</span>
                        <span className="font-bold text-lg sm:text-xl text-accentGreen">₹{crop.currentPrice}</span>
                      </div>
                      
                      <div className="bg-accentGreen/20 p-3 rounded-lg border border-accentGreen/30">
                        <div className="flex justify-between mb-1">
                          <span className="text-accentGreen font-medium text-sm">Profitability Score:</span>
                          <span className="font-bold text-cream">{crop.profitability}</span>
                        </div>
                        <div className="text-xs text-cream/60">Based on price trends & cultivation costs</div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-cream/70 text-sm">Market Risk:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(crop.riskLevel)}`}>
                          {crop.riskLevel}
                        </span>
                      </div>
                      
                      <div className="bg-darkGreen/60 p-2 rounded text-sm border border-darkGreen/40">
                        <div className="flex items-center">
                          {getTrendIcon(crop.priceTrend)}
                          <span className="ml-2 font-medium text-cream/80">Price Trend:</span>
                        </div>
                        <div className="text-cream/60 mt-1 text-xs">{crop.priceTrend}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Investment Recommendations */}
            <div className="bg-gradient-to-r from-darkGreen/80 to-deepGreen/80 rounded-xl shadow-lg p-4 sm:p-6 border border-accentGreen/30">
              <h2 className="text-xl sm:text-2xl font-bold text-cream mb-4 flex items-center">
                <FiTrendingUp className="mr-2 text-accentGreen" />
                Investment Recommendations
              </h2>
              <p className="text-cream/70 mb-4 text-sm sm:text-base">Top profitable crops to cultivate based on current market analysis</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {analyticsData.recommendations?.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-accentGreen/20 to-darkGreen/40 p-4 rounded-lg border-l-4 border-accentGreen hover:from-accentGreen/30 hover:to-darkGreen/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-cream text-sm sm:text-base">{rec.crop}</h3>
                      <FiDollarSign className="text-accentGreen" />
                    </div>
                    <p className="text-cream/70 text-xs sm:text-sm">{rec.reason}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Detailed Crop Trends */}
            {trendData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-darkGreen/80 to-deepGreen/80 rounded-xl shadow-lg p-4 sm:p-6 border border-accentGreen/30"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-cream mb-4 flex items-center flex-wrap">
                  <FiBarChart2 className="mr-2 text-accentGreen" />
                  <span className="mr-2">Price Analysis:</span>
                  <span className="text-accentGreen">{selectedCrop}</span>
                  {loadingTrends && <FiRefreshCw className="animate-spin ml-2 text-cream/60" />}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-400/30">
                      <h3 className="font-semibold text-blue-300 mb-2">Price Analysis</h3>
                      <p className="text-sm text-cream/80">{trendData.priceAnalysis}</p>
                    </div>
                    
                    <div className="bg-accentGreen/20 p-4 rounded-lg border border-accentGreen/30">
                      <h3 className="font-semibold text-accentGreen mb-2">Market Factors</h3>
                      <p className="text-sm text-cream/80">{trendData.marketFactors}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-400/30">
                      <h3 className="font-semibold text-purple-300 mb-2">Future Outlook</h3>
                      <p className="text-sm text-cream/80">{trendData.futureOutlook}</p>
                    </div>
                    
                    <div className="bg-orange-500/20 p-4 rounded-lg border border-orange-400/30">
                      <h3 className="font-semibold text-orange-300 mb-2">Investment Advice</h3>
                      <p className="text-sm text-cream/80">{trendData.investmentAdvice}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!analyticsData && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 bg-gradient-to-r from-darkGreen/60 to-deepGreen/60 rounded-xl border border-accentGreen/30"
          >
            <FiDollarSign className="mx-auto text-4xl sm:text-6xl text-accentGreen/60 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-cream mb-2">
              No Price Data Available
            </h3>
            <p className="text-cream/70 mb-6 text-sm sm:text-base px-4">
              Click "Analyze Market Prices" to get current crop pricing and profitability insights for your area
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Analytics;