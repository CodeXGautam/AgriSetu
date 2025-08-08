import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import LoadingAnimation from '../Components/LoadingAnimation';
import leaf1 from '../images/leaf1.png';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
        <div className="min-h-screen bg-gradient-to-r from-deepGreen to-gradientLight text-text overflow-hidden">
            <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
                {/* Background Elements */}
                <motion.img 
                    src={leaf1} 
                    alt="" 
                    className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[450px] lg:h-[450px] rotate-180 -top-12 -right-8 sm:-right-16 lg:-right-32 opacity-20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.2, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                />
                <motion.img 
                    src={leaf1} 
                    alt="" 
                    className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[450px] lg:h-[450px] rotate-90 -top-12 -left-8 sm:-left-16 lg:-left-32 opacity-20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.2, scale: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                />

                {/* Lottie Animations */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="absolute -right-16 sm:-right-32 lg:-right-32 bottom-0 -rotate-45 hidden sm:block"
                >
                    <DotLottieReact
                        src="https://lottie.host/7f7a8c25-9ca8-4bf1-a2b0-cedc4ef9de7d/kupgc4LV4I.lottie"
                        loop
                        autoplay
                        alternate
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute -left-16 sm:-left-32 lg:-left-32 bottom-0 rotate-45 hidden sm:block"
                >
                    <DotLottieReact
                        src="https://lottie.host/7f7a8c25-9ca8-4bf1-a2b0-cedc4ef9de7d/kupgc4LV4I.lottie"
                        loop
                        autoplay
                        alternate
                    />
                </motion.div>

                {/* Main Content */}
                <div className="flex flex-col justify-center items-center gap-6 sm:gap-8 text-center z-10 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cream"
                    >
                        Grow Smart
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-cream"
                    >
                        Increase your Productivity and Profits
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-base sm:text-lg md:text-xl text-cream max-w-2xl"
                    >
                        AI enabled crops prediction
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="text-base sm:text-lg md:text-xl text-cream max-w-2xl"
                    >
                        Get the best crops for your land
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-accentGreen text-white px-8 py-4 rounded-xl hover:bg-lightGreen transition-all duration-300 shadow-lg shadow-black text-lg font-semibold"
                        onClick={clickHandler}
                    >
                        Get Started
                    </motion.button>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream mb-4">
                            Multiple Domains
                        </h2>
                        <p className="text-lg sm:text-xl text-cream">
                            Choose from different Domains
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="relative border-2 border-accentGreen rounded-xl p-8 sm:p-12 lg:p-20 overflow-hidden"
                    >
                        <motion.img 
                            src="https://cdn.prod.website-files.com/61a05ff14c09ecacc06eec05/6720e94e1cd203b14c045522_%20Interview-Notes.jpg"
                            alt="Productivity" 
                            className="w-full max-w-4xl mx-auto opacity-20 rounded-xl shadow-xl shadow-accentGreen"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 0.2, scale: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 p-4">
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                viewport={{ once: true }}
                                className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream mb-4"
                            >
                                Ace your Productivity and Yield
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                viewport={{ once: true }}
                                className="text-sm sm:text-base md:text-lg font-semibold text-cream mb-6 max-w-2xl"
                            >
                                AI enabled personalised crops and disease detection
                            </motion.p>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-accentGreen text-white px-6 py-3 rounded-xl hover:bg-darkBrown transition-all duration-300 shadow-md shadow-darkBrown font-bold"
                                onClick={clickHandler}
                            >
                                Get Started
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;