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

    // Trending agricultural news data
    const trendingNews = [
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
        // Auto-slide every 5 seconds
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % trendingNews.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [trendingNews.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % trendingNews.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + trendingNews.length) % trendingNews.length);
    };

    return (
        <div className="flex w-full min-h-screen relative gap-4 overflow-hidden bg-gradient-to-r from-deepGreen to-gradientLight text-cream">
            <Sidebar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

            <div className="w-full max-h-screen bg-darkGreen flex flex-col gap-8 transition-all duration-300 ease-in-out rounded-md shadow-md shadow-darkBrown p-5 overflow-y-scroll">

                {/* Trending News Slider */}
                <section className="relative h-80 sm:h-96 md:h-[450px] overflow-hidden rounded-xl">
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
                                src={trendingNews[currentSlide].image}
                                alt={trendingNews[currentSlide].title}
                                className="w-full h-full object-cover"
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
                                        {trendingNews[currentSlide].category}
                                    </motion.div>
                                    
                                    <motion.h2
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-cream mb-4 leading-tight"
                                    >
                                        {trendingNews[currentSlide].title}
                                    </motion.h2>
                                    
                                    <motion.p
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.8 }}
                                        className="text-sm sm:text-base md:text-lg lg:text-xl text-cream mb-6 leading-relaxed"
                                    >
                                        {trendingNews[currentSlide].description}
                                    </motion.p>
                                    
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8, delay: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
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
                            {trendingNews.map((_, index) => (
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
                </section>

                <Footer />
            </div>

        </div>
    )
}

export default Home;