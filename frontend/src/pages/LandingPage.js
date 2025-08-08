import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import LoadingAnimation from '../Components/LoadingAnimation';
import leaf1 from '../images/leaf1.png';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FaRobot, FaLeaf, FaNewspaper, FaStore, FaCloudSun, FaCamera, FaArrowRight } from 'react-icons/fa';

const LandingPage = (props) => {
    const loggedIn = props.loggedIn;
    const setLoggedIn = props.setLoggedIn;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const clickHandler = () => {
        navigate('/register');
    };

    if (isLoading) {
        return <LoadingAnimation />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-deepGreen to-gradientLight text-text overflow-x-hidden">
            <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
                {/* Background Elements - Much smaller and responsive */}
                <motion.img 
                    src={leaf1} 
                    alt="" 
                    className="absolute w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] md:w-[160px] md:h-[160px] lg:w-[200px] lg:h-[200px] rotate-180 -top-4 -right-2 sm:-top-6 sm:-right-4 md:-top-8 md:-right-6 lg:-top-10 lg:-right-8 opacity-20 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.2, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                />
                <motion.img 
                    src={leaf1} 
                    alt="" 
                    className="absolute w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] md:w-[160px] md:h-[160px] lg:w-[200px] lg:h-[200px] rotate-90 -top-4 -left-2 sm:-top-6 sm:-left-4 md:-top-8 md:-left-6 lg:-top-10 lg:-left-8 opacity-20 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.2, scale: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                />

                {/* Lottie Animations - Hidden on mobile, constrained size */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="absolute -right-4 sm:-right-8 md:-right-12 lg:-right-16 bottom-0 -rotate-45 hidden md:block pointer-events-none"
                >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                        <DotLottieReact
                            src="https://lottie.host/7f7a8c25-9ca8-4bf1-a2b0-cedc4ef9de7d/kupgc4LV4I.lottie"
                            loop
                            autoplay
                            alternate
                        />
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute -left-4 sm:-left-8 md:-left-12 lg:-left-16 bottom-0 rotate-45 hidden md:block pointer-events-none"
                >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                        <DotLottieReact
                            src="https://lottie.host/7f7a8c25-9ca8-4bf1-a2b0-cedc4ef9de7d/kupgc4LV4I.lottie"
                            loop
                            autoplay
                            alternate
                        />
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 text-center z-10 max-w-4xl mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-cream leading-tight"
                    >
                        Grow Smart
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-cream leading-tight px-2"
                    >
                        Increase your Productivity and Profits
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-base sm:text-lg md:text-xl lg:text-2xl text-cream max-w-3xl leading-relaxed"
                    >
                        AI enabled crops prediction
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="text-base sm:text-lg md:text-xl lg:text-2xl text-cream max-w-3xl leading-relaxed"
                    >
                        Get the best crops for your land
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-accentGreen text-white px-8 py-4 sm:px-10 sm:py-5 rounded-xl hover:bg-lightGreen transition-all duration-300 shadow-lg shadow-black text-lg sm:text-xl font-semibold"
                        onClick={clickHandler}
                    >
                        Get Started
                    </motion.button>
                </div>
            </section>

            {/* AI Chatbot Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-center lg:text-left"
                        >
                            <div className="flex justify-center lg:justify-start mb-6">
                                <div className="bg-accentGreen p-4 rounded-full">
                                    <FaRobot className="text-3xl text-cream" />
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-4 leading-tight">
                                AI Chatbot for Farmers
                            </h3>
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cream mb-6 leading-relaxed">
                                Get instant solutions to your farming problems. Our AI chatbot provides real-time assistance for crop management, pest control, and agricultural best practices.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-accentGreen text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl hover:bg-lightGreen transition-all duration-300 shadow-lg font-semibold text-base sm:text-lg"
                                onClick={clickHandler}
                            >
                                Start Chat
                            </motion.button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <img 
                                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                alt="AI Chatbot" 
                                className="w-full rounded-xl shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Crop Recommendations Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 bg-darkGreen/30">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="relative order-2 lg:order-1"
                        >
                            <img 
                                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                alt="Crop Recommendations" 
                                className="w-full rounded-xl shadow-2xl"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="text-center lg:text-left order-1 lg:order-2"
                        >
                            <div className="flex justify-center lg:justify-start mb-6">
                                <div className="bg-accentGreen p-4 rounded-full">
                                    <FaLeaf className="text-3xl text-cream" />
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-4 leading-tight">
                                Best Crops for Your Location
                            </h3>
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cream mb-6 leading-relaxed">
                                Get personalized crop recommendations based on your location, soil type, and climate. Includes sale pricing and profitability analysis to maximize your returns.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-accentGreen text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl hover:bg-lightGreen transition-all duration-300 shadow-lg font-semibold text-base sm:text-lg"
                                onClick={clickHandler}
                            >
                                Get Recommendations
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* News & Marketplace Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Agriculture News */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-darkGreen/30 rounded-xl p-6 sm:p-8 border-2 border-accentGreen"
                        >
                            <div className="flex items-center mb-6">
                                <div className="bg-accentGreen p-3 rounded-full mr-4">
                                    <FaNewspaper className="text-2xl text-cream" />
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-cream leading-tight">
                                    Agriculture News
                                </h3>
                            </div>
                            <p className="text-base sm:text-lg md:text-xl text-cream mb-6 leading-relaxed">
                                Stay updated with the latest agricultural trends, government policies, and market insights that affect your farming business.
                            </p>
                            <img 
                                src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                alt="Agriculture News" 
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-accentGreen text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-lightGreen transition-all duration-300 font-semibold text-sm sm:text-base"
                                onClick={clickHandler}
                            >
                                Read Latest News
                            </motion.button>
                        </motion.div>

                        {/* Marketplace */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="bg-darkGreen/30 rounded-xl p-6 sm:p-8 border-2 border-accentGreen"
                        >
                            <div className="flex items-center mb-6">
                                <div className="bg-accentGreen p-3 rounded-full mr-4">
                                    <FaStore className="text-2xl text-cream" />
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-cream leading-tight">
                                    Crop Essentials Marketplace
                                </h3>
                            </div>
                            <p className="text-base sm:text-lg md:text-xl text-cream mb-6 leading-relaxed">
                                Buy and sell seeds, fertilizers, tools, and other agricultural essentials. Connect with verified suppliers and get the best prices.
                            </p>
                            <img 
                                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                alt="Marketplace" 
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-accentGreen text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-lightGreen transition-all duration-300 font-semibold text-sm sm:text-base"
                                onClick={clickHandler}
                            >
                                Explore Marketplace
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Weather & Disease Detection Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 bg-darkGreen/30">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Weather Alerts */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-darkGreen/30 rounded-xl p-6 sm:p-8 border-2 border-accentGreen"
                        >
                            <div className="flex items-center mb-6">
                                <div className="bg-accentGreen p-3 rounded-full mr-4">
                                    <FaCloudSun className="text-2xl text-cream" />
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-cream leading-tight">
                                    Weather Alerts
                                </h3>
                            </div>
                            <p className="text-base sm:text-lg md:text-xl text-cream mb-6 leading-relaxed">
                                Get real-time weather updates and alerts for your location. Plan your farming activities based on accurate weather forecasts.
                            </p>
                            <img 
                                src="https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Weather Alerts" 
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-accentGreen text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-lightGreen transition-all duration-300 font-semibold text-sm sm:text-base"
                                onClick={clickHandler}
                            >
                                Check Weather
                            </motion.button>
                        </motion.div>

                        {/* Disease Detection */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="bg-darkGreen/30 rounded-xl p-6 sm:p-8 border-2 border-accentGreen"
                        >
                            <div className="flex items-center mb-6">
                                <div className="bg-accentGreen p-3 rounded-full mr-4">
                                    <FaCamera className="text-2xl text-cream" />
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-cream leading-tight">
                                    Disease Detection
                                </h3>
                            </div>
                            <p className="text-base sm:text-lg md:text-xl text-cream mb-6 leading-relaxed">
                                Upload images of your crops to get instant AI-powered disease detection and treatment recommendations.
                            </p>
                            <img 
                                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Disease Detection" 
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-accentGreen text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-lightGreen transition-all duration-300 font-semibold text-sm sm:text-base"
                                onClick={clickHandler}
                            >
                                Upload Image
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-cream mb-6 leading-tight"
                    >
                        Ready to Transform Your Farming?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="text-base sm:text-lg md:text-xl lg:text-2xl text-cream mb-8 max-w-3xl mx-auto leading-relaxed"
                    >
                        Join thousands of farmers who are already using AgriSetu to increase their productivity and profits with AI-powered solutions.
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-accentGreen text-white px-8 py-4 sm:px-10 sm:py-5 rounded-xl hover:bg-lightGreen transition-all duration-300 shadow-lg shadow-black text-lg sm:text-xl font-semibold flex items-center justify-center mx-auto gap-2"
                        onClick={clickHandler}
                    >
                        Get Started Now <FaArrowRight />
                    </motion.button>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;