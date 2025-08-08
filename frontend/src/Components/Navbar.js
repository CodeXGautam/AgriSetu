import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Navbar = (props) => {
    const loggedIn = props.loggedIn;
    const setLoggedIn = props.setLoggedIn;
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logOutHandler = async() =>{
        try{
            await fetch(process.env.REACT_APP_BACKEND_URI + '/logout', {
                method: 'GET',
                credentials: 'include',
            })
            .then(response => response.json())
            .then(response => {
                if(response.message === "User not found"){
                    toast.error("User not found");
                    return;
                }
                
                if(response.message === "Logged out successfully"){
                    toast.success("Logged out");
                    navigate('/');
                    setLoggedIn(false);
                }
            })
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-l from-deepGreen to-gradientLight border-b-2 border-gradientLight shadow-md"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to='/' className="flex items-center text-2xl font-extrabold text-cream hover:text-lightBrown transition-colors duration-200">
                            AgriSetu
                        </Link>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {!loggedIn && (
                            <>
                                <NavLink to='/product' className='text-cream hover:text-lightBrown p-2 rounded-xl transition-all duration-200 hover:bg-accentGreen/20'>
                                    Product
                                </NavLink>
                                <NavLink to='/pricing' className='text-cream hover:text-lightBrown p-2 rounded-xl transition-all duration-200 hover:bg-accentGreen/20'>
                                    Pricing
                                </NavLink>
                                <NavLink to='/resources' className='text-cream hover:text-lightBrown p-2 rounded-xl transition-all duration-200 hover:bg-accentGreen/20'>
                                    Resources
                                </NavLink>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <NavLink to='/register' className='flex justify-center items-center bg-accentGreen p-2 rounded-xl hover:bg-lightGreen transition-all duration-200 shadow-md text-cream'>
                                        Get Started
                                    </NavLink>
                                </motion.div>
                            </>
                        )}

                        {loggedIn && (
                            <>
                                <NavLink to='/home' className='text-cream hover:text-lightBrown p-2 rounded-xl transition-all duration-200 hover:bg-accentGreen/20'>
                                    Home
                                </NavLink>
                                <NavLink to='/scan' className='text-cream hover:text-lightBrown p-2 rounded-xl transition-all duration-200 hover:bg-accentGreen/20'>
                                    Scan
                                </NavLink>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='text-accentGreen font-semibold hover:text-lightBrown p-2 rounded-xl transition-all duration-200 hover:bg-accentGreen/20'
                                    onClick={logOutHandler}
                                >
                                    LogOut
                                </motion.button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleMenu}
                            className="text-cream hover:text-lightBrown transition-colors duration-200"
                        >
                            {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-gradient-to-b from-deepGreen to-gradientLight border-t border-accentGreen"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {!loggedIn && (
                                <>
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <NavLink 
                                            to='/product' 
                                            className='block text-cream hover:text-lightBrown p-2 rounded-xl transition-all duration-200 hover:bg-accentGreen/20'
                                            onClick={closeMenu}
                                        >
                                            Product
                                        </NavLink>
                                    </motion.div>
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <NavLink 
                                            to='/pricing' 
                                            className='block text-cream hover:text-lightBrown p-2 rounded-xl transition-all duration-200 hover:bg-accentGreen/20'
                                            onClick={closeMenu}
                                        >
                                            Pricing
                                        </NavLink>
                                    </motion.div>
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <NavLink 
                                            to='/resources' 
                                            className='block text-cream hover:text-lightBrown p-2 rounded-xl transition-all duration-200 hover:bg-accentGreen/20'
                                            onClick={closeMenu}
                                        >
                                            Resources
                                        </NavLink>
                                    </motion.div>
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <NavLink 
                                            to='/register' 
                                            className='block bg-accentGreen text-cream p-2 rounded-xl hover:bg-lightGreen transition-all duration-200 text-center'
                                            onClick={closeMenu}
                                        >
                                            Get Started
                                        </NavLink>
                                    </motion.div>
                                </>
                            )}

                            {loggedIn && (
                                <>
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <NavLink 
                                            to='/home' 
                                            className='block text-cream hover:text-lightBrown p-2 rounded-xl transition-all duration-200 hover:bg-accentGreen/20'
                                            onClick={closeMenu}
                                        >
                                            Home
                                        </NavLink>
                                    </motion.div>
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <NavLink 
                                            to='/scan' 
                                            className='block text-cream hover:text-lightBrown p-2 rounded-xl transition-all duration-200 hover:bg-accentGreen/20'
                                            onClick={closeMenu}
                                        >
                                            Scan
                                        </NavLink>
                                    </motion.div>
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <button 
                                            className='block w-full text-left text-accentGreen font-semibold hover:text-lightBrown p-2 rounded-xl transition-all duration-200 hover:bg-accentGreen/20'
                                            onClick={() => {
                                                logOutHandler();
                                                closeMenu();
                                            }}
                                        >
                                            LogOut
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;