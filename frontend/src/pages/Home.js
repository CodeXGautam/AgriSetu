import { BiSolidDashboard } from "react-icons/bi";
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

    // Fetch news from the API
    const fetchNews = async () => {
        try {
            setLoading(true);
            const url = `${process.env.REACT_APP_BACKEND_URI}/news/agriculture?language=en&page=1`;
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
                setNewsData(slideshowNews);
            } else {
                // Fallback to default news if API fails
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

    useEffect(() => {
        fetchNews();
    }, []);

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
            <div className="flex w-full min-h-screen relative gap-4 overflow-hidden bg-gradient-to-r from-deepGreen to-gradientLight text-cream">
                <Sidebar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                <div className="w-full max-h-screen bg-darkGreen flex flex-col gap-8 transition-all duration-300 ease-in-out rounded-md shadow-md shadow-darkBrown p-5 overflow-y-scroll">
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

    return (
        <div className="flex w-full min-h-screen relative gap-4 overflow-hidden bg-gradient-to-r from-deepGreen to-gradientLight text-cream">
            <Sidebar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

            <div className="w-full max-h-screen bg-darkGreen flex flex-col gap-8 transition-all duration-300 ease-in-out rounded-md shadow-md shadow-darkBrown p-5 overflow-y-scroll">

                {/* Trending News Slider */}
                <section className="relative h-80 sm:h-96 md:h-[450px] overflow-hidden rounded-xl">
                    {newsData.length > 0 && (
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
                                        className="max-w-2xl"
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
                                            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-cream mb-4 leading-tight"
                                        >
                                            {newsData[currentSlide].title}
                                        </motion.h2>
                                        
                                        <motion.p
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.8 }}
                                            className="text-sm sm:text-base md:text-lg lg:text-xl text-cream mb-6 leading-relaxed"
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
                                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                                            index === currentSlide 
                                                ? 'bg-accentGreen scale-125' 
                                                : 'bg-cream/50 hover:bg-cream/80'
                                        }`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Error State */}
                    {error && newsData.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-cream">
                                <div className="text-6xl mb-4">📰</div>
                                <h3 className="text-xl font-semibold mb-2">News Unavailable</h3>
                                <p className="text-cream/80 mb-4">Unable to load latest news at the moment</p>
                                <button 
                                    onClick={fetchNews}
                                    className="bg-accentGreen text-white px-4 py-2 rounded-lg hover:bg-lightGreen transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                <Footer />
            </div>

        </div>
    )
}

export default Home;