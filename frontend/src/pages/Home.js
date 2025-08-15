import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";

const Home = (props) => {
    const loggedIn = props.loggedIn;
    const setLoggedIn = props.setLoggedIn;
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState(null);

    // Fetch news from the API
    const fetchNews = async () => {
        try {
            setLoading(true);
            // const url = `${process.env.REACT_APP_BACKEND_URI}/news/agriculture?language=en&page=1`;
            const url = ``;
            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const output = await response.json();

            if (output.success && output.data && output.data.length > 0) {
                // Take first 5 news items for slideshow
                const slideshowNews = output.data.slice(0, 5).map((news, index) => ({
                    id: index + 1,
                    title: news.title || 'Agriculture News',
                    description: news.snippet || 'Latest updates from the agriculture sector',
                    image: news.thumbnail || getDefaultImage(index),
                    category: getCategoryFromTitle(news.title),
                    link: news.link,
                    date: news.date
                }));
                console.log('News data fetched successfully:', slideshowNews);
                setNewsData(slideshowNews);
            } else {
                // Fallback to default news if API fails
                console.log('API returned no data, using default news');
                setNewsData(getDefaultNews());
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            setError(error.message);
            // Fallback to default news if API fails
            setNewsData(getDefaultNews());
        } finally {
            setLoading(false);
        }
    };

    // Get default image based on index
    const getDefaultImage = (index) => {
        const defaultImages = [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ];
        return defaultImages[index % defaultImages.length];
    };

    // Get category from news title
    const getCategoryFromTitle = (title) => {
        if (!title) return 'Agriculture';

        const titleLower = title.toLowerCase();
        if (titleLower.includes('ai') || titleLower.includes('technology') || titleLower.includes('digital')) {
            return 'Technology';
        } else if (titleLower.includes('government') || titleLower.includes('policy') || titleLower.includes('subsidy')) {
            return 'Policy';
        } else if (titleLower.includes('climate') || titleLower.includes('sustainable') || titleLower.includes('organic')) {
            return 'Sustainability';
        } else if (titleLower.includes('market') || titleLower.includes('price') || titleLower.includes('trade')) {
            return 'Market';
        } else if (titleLower.includes('crop') || titleLower.includes('yield') || titleLower.includes('farming')) {
            return 'Farming';
        } else {
            return 'Agriculture';
        }
    };

    // Default news fallback
    const getDefaultNews = () => [
        {
            id: 1,
            title: "New AI Technology Revolutionizes Crop Yield Prediction",
            description: "Farmers across the country are adopting advanced AI algorithms that can predict crop yields with 95% accuracy, leading to better planning and increased profits.",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            category: "Technology"
        },
        {
            id: 2,
            title: "Government Announces New Subsidies for Organic Farming",
            description: "The Ministry of Agriculture has launched a comprehensive subsidy program to encourage farmers to adopt organic farming practices and sustainable agriculture methods.",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            category: "Policy"
        },
        {
            id: 3,
            title: "Climate-Smart Agriculture Practices Show Promising Results",
            description: "Farmers implementing climate-smart agriculture techniques have reported 30% higher yields while reducing water consumption and environmental impact.",
            image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            category: "Sustainability"
        },
        {
            id: 4,
            title: "Digital Marketplace Connects Farmers Directly to Consumers",
            description: "New online platforms are eliminating middlemen, allowing farmers to sell their produce directly to consumers at better prices while ensuring fresh delivery.",
            image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            category: "Market"
        }
    ];

    const getLocation = () => {
        if ("geolocation" in navigator) {
            setLocationLoading(true);
            setLocationError(null);
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    };
                    setLocation(newLocation);
                    setLocationError(null);
                    setLocationLoading(false);
                    console.log('Location retrieved successfully:', newLocation);
                },
                (err) => {
                    console.error('Geolocation error:', err);
                    setLocationError(err.message);
                    setLocation(null);
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

    // Function to get location-based weather (placeholder for future implementation)
    const getWeatherInfo = async () => {
        if (!location) return null;
        
        try {
            // This is a placeholder - you can integrate with a weather API later
            // For now, we'll just return basic location info
            return {
                coordinates: `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`,
                accuracy: 'High accuracy GPS',
                timestamp: new Date().toLocaleTimeString()
            };
        } catch (error) {
            console.error('Error getting weather info:', error);
            return null;
        }
    };

    // Get weather icon based on condition code and day/night
    const getWeatherIcon = (conditionCode, isDay) => {
        // Weather condition codes from WeatherAPI.com
        const weatherIcons = {
            1000: isDay ? '☀️' : '🌙', // Clear
            1003: isDay ? '🌤️' : '☁️', // Partly cloudy
            1006: '☁️', // Cloudy
            1009: '☁️', // Overcast
            1030: '🌫️', // Mist
            1063: '🌦️', // Patchy rain
            1066: '🌨️', // Patchy snow
            1069: '🌨️', // Patchy sleet
            1087: '⛈️', // Thundery outbreaks
            1114: '🌨️', // Blowing snow
            1117: '❄️', // Blizzard
            1135: '🌫️', // Fog
            1147: '🌫️', // Freezing fog
            1150: '🌦️', // Patchy light drizzle
            1153: '🌦️', // Light drizzle
            1168: '🌧️', // Heavy drizzle
            1171: '🌧️', // Heavy drizzle
            1180: '🌦️', // Patchy light rain
            1183: '🌦️', // Light rain
            1186: '🌧️', // Moderate rain
            1189: '🌧️', // Moderate rain
            1192: '🌧️', // Heavy rain
            1195: '🌧️', // Heavy rain
            1198: '🌦️', // Light freezing rain
            1201: '🌧️', // Moderate or heavy freezing rain
            1204: '🌨️', // Light sleet
            1207: '🌨️', // Moderate or heavy sleet
            1210: '🌨️', // Patchy light snow
            1213: '🌨️', // Light snow
            1216: '🌨️', // Patchy moderate snow
            1219: '🌨️', // Moderate snow
            1222: '❄️', // Patchy heavy snow
            1225: '❄️', // Heavy snow
            1237: '🧊', // Ice pellets
            1240: '🌦️', // Light rain shower
            1243: '🌧️', // Moderate or heavy rain shower
            1246: '🌧️', // Torrential rain shower
            1249: '🌨️', // Light sleet showers
            1252: '🌨️', // Moderate or heavy sleet showers
            1255: '🌨️', // Light snow showers
            1258: '🌨️', // Moderate or heavy snow showers
            1261: '🧊', // Light ice pellet showers
            1264: '🧊', // Moderate or heavy ice pellet showers
            1273: '⛈️', // Patchy light rain with thunder
            1276: '⛈️', // Moderate or heavy rain with thunder
            1279: '⛈️', // Patchy light snow with thunder
            1282: '⛈️', // Moderate or heavy snow with thunder
        };
        
        return weatherIcons[conditionCode] || '🌤️';
    };

    // Get weather severity and recommendations
    const getWeatherSeverity = (weatherData) => {
        if (!weatherData) return null;
        
        const current = weatherData.current;
        const forecast = weatherData.forecast?.forecastday?.[0]?.day;
        
        const alerts = [];
        let severity = 'good';
        
        // Temperature checks
        if (current?.temp_c > 35) {
            alerts.push({
                type: 'temperature',
                severity: 'high',
                message: 'High temperature alert! Stay hydrated and avoid outdoor activities during peak hours.',
                icon: '🔥'
            });
            severity = 'warning';
        } else if (current?.temp_c < 5) {
            alerts.push({
                type: 'temperature',
                severity: 'high',
                message: 'Low temperature alert! Protect crops from frost damage.',
                icon: '❄️'
            });
            severity = 'warning';
        }
        
        // Rain checks
        if (forecast?.daily_chance_of_rain > 70) {
            alerts.push({
                type: 'rain',
                severity: forecast?.daily_chance_of_rain > 90 ? 'high' : 'medium',
                message: `High chance of rain (${forecast.daily_chance_of_rain}%). Plan irrigation accordingly.`,
                icon: '🌧️'
            });
            if (forecast?.daily_chance_of_rain > 90) severity = 'warning';
        }
        
        // Wind checks
        if (current?.wind_kph > 30) {
            alerts.push({
                type: 'wind',
                severity: current?.wind_kph > 50 ? 'high' : 'medium',
                message: `Strong winds (${current.wind_kph} km/h). Secure loose items and protect crops.`,
                icon: '💨'
            });
            if (current?.wind_kph > 50) severity = 'warning';
        }
        
        // UV Index checks
        if (current?.uv > 8) {
            alerts.push({
                type: 'uv',
                severity: 'high',
                message: 'Very high UV index! Protect yourself and crops from sun damage.',
                icon: '☀️'
            });
            severity = 'warning';
        }
        
        // Visibility checks
        if (current?.vis_km < 5) {
            alerts.push({
                type: 'visibility',
                severity: 'medium',
                message: 'Low visibility conditions. Exercise caution with outdoor activities.',
                icon: '🌫️'
            });
        }
        
        return {
            severity,
            alerts,
            recommendations: getWeatherRecommendations(severity, alerts)
        };
    };

    // Get weather recommendations based on severity
    const getWeatherRecommendations = (severity, alerts) => {
        const recommendations = [];
        
        if (severity === 'good') {
            recommendations.push('🌱 Perfect weather for farming activities');
            recommendations.push('💧 Normal irrigation schedule recommended');
            recommendations.push('🌾 Good conditions for crop growth');
        } else if (severity === 'warning') {
            recommendations.push('⚠️ Monitor weather conditions closely');
            recommendations.push('🛡️ Take protective measures for crops');
            recommendations.push('📱 Stay updated with weather alerts');
        }
        
        alerts.forEach(alert => {
            if (alert.type === 'temperature' && alert.severity === 'high') {
                recommendations.push('🌡️ Adjust irrigation timing to early morning/evening');
            }
            if (alert.type === 'rain' && alert.severity === 'high') {
                recommendations.push('☔ Reduce irrigation and prepare drainage');
            }
            if (alert.type === 'wind' && alert.severity === 'high') {
                recommendations.push('🏗️ Secure farm structures and equipment');
            }
        });
        
        return recommendations;
    };

    // Fetch weather data from backend
    const fetchWeather = async () => {
        if (!location) return;
        
        try {
            setWeatherLoading(true);
            setWeatherError(null);
            
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/weather`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lat: location.lat,
                    lon: location.lon
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const output = await response.json();
            
            if (output.success && output.data) {
                setWeatherData(output.data);
                console.log('Weather data fetched successfully:', output.data);
            } else {
                throw new Error(output.message || 'Failed to fetch weather data');
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            setWeatherError(error.message);
        } finally {
            setWeatherLoading(false);
        }
    };

    useEffect(() => {
        console.log('Home component mounted, fetching news and location...');
        fetchNews();
        getLocation();
    }, []);

    // Log location when it changes
    // useEffect(() => {
    //     if (location) {
    //         console.log('Current location:', location);
    //     }
    // }, [location]);

    // Log location errors when they occur
    useEffect(() => {
        if (locationError) {
            console.log('Location error:', locationError);
        }
    }, [locationError]);

    // Fetch weather when location is available
    useEffect(() => {
        if (location) {
            console.log('Current location:', location);
            fetchWeather();
        }
    }, [location]);

    useEffect(() => {
        if (newsData.length === 0) return;

        // Auto-slide every 5 seconds
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % newsData.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [newsData.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % newsData.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + newsData.length) % newsData.length);
    };

    const handleReadMore = () => {
        if (newsData[currentSlide] && newsData[currentSlide].link) {
            window.open(newsData[currentSlide].link, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="flex w-full h-screen bg-gradient-to-r from-deepGreen to-gradientLight text-cream">
                <Sidebar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                <div className="w-full h-full bg-darkGreen flex flex-col gap-6 transition-all duration-300 ease-in-out rounded-md shadow-md shadow-darkBrown p-4 overflow-y-auto">
                    <div className="flex justify-center items-center h-80 sm:h-96 md:h-[450px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-accentGreen border-t-cream mx-auto mb-4"></div>
                            <p className="text-cream text-lg font-medium">Loading latest news...</p>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }

    console.log('Rendering Home component, newsData length:', newsData.length, 'loading:', loading);
    
    return (
        <div className="flex w-full h-screen bg-gradient-to-r from-deepGreen to-gradientLight text-cream">
            <Sidebar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

            <div className="w-full h-full bg-darkGreen flex flex-col gap-6 transition-all duration-300 ease-in-out rounded-md shadow-md shadow-darkBrown p-4 overflow-y-auto">

                {/* Trending News Slider */}
                <section className="relative min-h-[400px] h-[500px] overflow-hidden rounded-xl shadow-md shadow-black bg-gradient-to-r from-deepGreen/80 to-darkGreen/80">
                    {console.log('Rendering slideshow, currentSlide:', currentSlide, 'newsData:', newsData[currentSlide])}
                    {newsData.length > 0 ? (
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-full h-full"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={newsData[currentSlide].image}
                                    alt={newsData[currentSlide].title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = getDefaultImage(currentSlide);
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-deepGreen/80 via-deepGreen/60 to-transparent"></div>
                            </div>

                            {/* Content Overlay */}
                            <div className="relative z-10 h-full flex items-center">
                                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="max-w-2xl lg:max-w-3xl"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.4 }}
                                            className="inline-block bg-accentGreen text-cream px-4 py-2 rounded-full text-sm sm:text-base font-semibold mb-4"
                                        >
                                            {newsData[currentSlide].category}
                                        </motion.div>

                                        <motion.h2
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.6 }}
                                            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-cream mb-3 sm:mb-4 leading-tight"
                                        >
                                            {newsData[currentSlide].title}
                                        </motion.h2>

                                        <motion.p
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.8 }}
                                            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-cream mb-4 sm:mb-6 leading-relaxed line-clamp-3 lg:line-clamp-4"
                                        >
                                            {newsData[currentSlide].description}
                                        </motion.p>

                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.8, delay: 1 }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleReadMore}
                                            className="bg-accentGreen text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl hover:bg-lightGreen transition-all duration-300 shadow-lg font-semibold text-sm sm:text-base"
                                        >
                                            Read More
                                        </motion.button>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-accentGreen/80 hover:bg-accentGreen text-cream p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 z-20"
                            >
                                <FaChevronLeft className="text-lg sm:text-xl" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-accentGreen/80 hover:bg-accentGreen text-cream p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 z-20"
                            >
                                <FaChevronRight className="text-lg sm:text-xl" />
                            </motion.button>

                            {/* Dots Indicator */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                                {newsData.map((_, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.8 }}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                                ? 'bg-accentGreen scale-125'
                                                : 'bg-cream/50 hover:bg-cream/80'
                                            }`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-cream">
                                <div className="text-6xl mb-4">📰</div>
                                <h3 className="text-xl font-semibold mb-2">Loading News...</h3>
                                <p className="text-cream/80 mb-4">Please wait while we fetch the latest updates</p>
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-accentGreen border-t-cream mx-auto"></div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Weather Dashboard */}
                {location && (
                    <section className="bg-gradient-to-br from-darkGreen/90 to-deepGreen/80 rounded-xl p-6 border border-accentGreen/30 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="text-3xl">🌤️</div>
                                <div>
                                    <h3 className="text-cream font-bold text-xl">Weather Dashboard</h3>
                                    <p className="text-cream/80 text-sm">
                                        {weatherData?.location?.name || 'Your Location'} • {weatherData?.location?.country || 'Loading...'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={fetchWeather}
                                disabled={weatherLoading}
                                className="bg-accentGreen text-white px-4 py-2 rounded-lg text-sm hover:bg-lightGreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {weatherLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>🔄</span>
                                        <span>Refresh</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {weatherLoading && (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-accentGreen border-t-transparent"></div>
                            </div>
                        )}

                        {weatherError && (
                            <div className="bg-red-900/50 border border-red-400/30 rounded-lg p-4 text-center">
                                <div className="text-red-400 text-xl mb-2">⚠️</div>
                                <p className="text-red-200 text-sm">{weatherError}</p>
                                <button
                                    onClick={fetchWeather}
                                    className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {weatherData && !weatherLoading && (
                            <div className="space-y-6">
                                {/* Current Weather */}
                                <div className="bg-darkGreen/50 backdrop-blur-sm rounded-xl p-6 border border-accentGreen/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-cream font-semibold text-lg mb-2">Current Weather</h4>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-4xl font-bold text-cream">
                                                    {weatherData.current?.temp_c}°C
                                                </div>
                                                <div>
                                                    <p className="text-cream/80 text-sm">
                                                        Feels like {weatherData.current?.feelslike_c}°C
                                                    </p>
                                                    <p className="text-cream/80 text-sm">
                                                        {weatherData.current?.condition?.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-6xl mb-2">
                                                {getWeatherIcon(weatherData.current?.condition?.code, weatherData.current?.is_day)}
                                            </div>
                                            <p className="text-cream/80 text-sm">
                                                Humidity: {weatherData.current?.humidity}%
                                            </p>
                                            <p className="text-cream/80 text-sm">
                                                Wind: {weatherData.current?.wind_kph} km/h
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 3-Day Forecast */}
                                <div className="bg-darkGreen/50 backdrop-blur-sm rounded-xl p-6 border border-accentGreen/20">
                                    <h4 className="text-cream font-semibold text-lg mb-4">3-Day Forecast</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {weatherData.forecast?.forecastday?.slice(0, 3).map((day, index) => (
                                            <div key={index} className="bg-darkGreen/30 rounded-lg p-4 text-center border border-accentGreen/10">
                                                <p className="text-cream/80 text-sm font-medium mb-2">
                                                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </p>
                                                <div className="text-3xl mb-2">
                                                    {getWeatherIcon(day.day.condition.code, 1)}
                                                </div>
                                                <p className="text-cream font-semibold text-lg mb-1">
                                                    {day.day.maxtemp_c}°C
                                                </p>
                                                <p className="text-cream/80 text-sm">
                                                    {day.day.mintemp_c}°C
                                                </p>
                                                <p className="text-cream/60 text-xs mt-1">
                                                    {day.day.condition.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Weather Alerts */}
                                {weatherData.alerts?.alert && weatherData.alerts.alert.length > 0 && (
                                    <div className="bg-red-900/50 border border-red-400/30 rounded-xl p-6">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="text-2xl">🚨</div>
                                            <h4 className="text-red-200 font-bold text-lg">Weather Alerts</h4>
                                        </div>
                                        <div className="space-y-3">
                                            {weatherData.alerts.alert.map((alert, index) => (
                                                <div key={index} className="bg-red-800/30 rounded-lg p-4 border border-red-400/20">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h5 className="text-red-200 font-semibold mb-2">{alert.headline}</h5>
                                                            <p className="text-red-300 text-sm mb-2">{alert.msg}</p>
                                                            <div className="flex items-center space-x-4 text-xs text-red-300">
                                                                <span>From: {new Date(alert.effective).toLocaleString()}</span>
                                                                <span>To: {new Date(alert.expires).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-red-400 text-2xl">⚠️</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Weather Summary */}
                                <div className="bg-darkGreen/50 backdrop-blur-sm rounded-xl p-6 border border-accentGreen/20">
                                    <h4 className="text-cream font-semibold text-lg mb-4">Weather Summary</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl mb-1">🌡️</div>
                                            <p className="text-cream/60 text-xs">Max Temp</p>
                                            <p className="text-cream font-semibold">
                                                {weatherData.forecast?.forecastday?.[0]?.day?.maxtemp_c}°C
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl mb-1">💧</div>
                                            <p className="text-cream/60 text-xs">Rain Chance</p>
                                            <p className="text-cream font-semibold">
                                                {weatherData.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain}%
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl mb-1">☀️</div>
                                            <p className="text-cream/60 text-xs">UV Index</p>
                                            <p className="text-cream font-semibold">
                                                {weatherData.current?.uv}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl mb-1">👁️</div>
                                            <p className="text-cream/60 text-xs">Visibility</p>
                                            <p className="text-cream font-semibold">
                                                {weatherData.current?.vis_km} km
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                <Footer />
            </div>

        </div>
    )
}

export default Home;