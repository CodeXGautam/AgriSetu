import { useEffect, useState } from "react";
import { NavLink, useNavigate } from 'react-router';
import { FcGoogle } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import LoadingAnimation from "../Components/LoadingAnimation";
import { toast } from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google';
import leaf2 from '../images/leaf2.png';

const RegisterPage = (props) => {
    const loggedIn = props.loggedIn;
    const setLoggedIn = props.setLoggedIn;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const autohome = () => {
        if (loggedIn) {
            navigate('/home');
        }
    };

    const changeHandler = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        
        try {
            if (!formData.firstname || !formData.lastname || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
                toast.error("All fields are required");
                setIsSubmitting(false);
                return;
            }

            if (formData.password.length < 6) {
                toast.error("Password must be at least 6 characters long");
                setFormData({
                    ...formData,
                    password: '',
                    confirmPassword: ''
                });
                setIsSubmitting(false);
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match");
                setIsSubmitting(false);
                return;
            }

            await fetch(process.env.REACT_APP_BACKEND_URI + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(response => {
                    if (response.message === "User already exists") {
                        console.log('Error: ', response.message);
                        setFormData({
                            firstname: '',
                            lastname: '',
                            username: '',
                            email: '',
                            password: '',
                            confirmPassword: ''
                        });
                        toast.error("User already exists");
                        setIsSubmitting(false);
                        return;
                    } else if (response.message === "Password must be at least 6 characters long") {
                        console.log('Error: ', response.message);
                        toast.error("Password must be at least 6 characters long");
                        setIsSubmitting(false);
                        return;
                    } else if (response.message === "User registration failed") {
                        console.log('Error:', response.message);
                        toast.error("User registration failed");
                        setIsSubmitting(false);
                        return;
                    } else if (response.message === "Internal server error") {
                        console.error('Error:', response.message);
                        toast.error("Failed to create user. Please try again.");
                        setIsSubmitting(false);
                        return;
                    } else if (response.message === "User registered successfully") {
                        console.log('Success:', response);
                        toast.success("Account Created");
                        setLoggedIn(true);
                        navigate('/home');

                        setFormData({
                            firstName: "",
                            lastName: "",
                            userName: "",
                            email: "",
                            password: "",
                            confirmPassword: ""
                        });

                        console.log("Form submitted");
                    }
                    setIsSubmitting(false);
                });
        } catch (error) {
            console.error('Error:', error);
            toast.error("Registration failed. Please try again.");
            setIsSubmitting(false);
        }
    };

    const [showpassword, setShowPassword] = useState(false);
    const [showconfirmPassword, setShowConfirmPassword] = useState(false);

    const passHandler = () => {
        setShowPassword(!showpassword);
    };

    const confirmPassHandler = () => {
        setShowConfirmPassword(!showconfirmPassword);
    };

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async ({ code }) => {
            try {
                const res = await fetch(process.env.REACT_APP_BACKEND_URI + '/auth/google-auth-code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ code })
                });
                const data = await res.json();
                if (res.ok) {
                    setLoggedIn(true);
                    toast.success("Account Created with Google!");
                    navigate('/home');
                } else {
                    toast.error(data.message || "Google registration failed");
                }
            } catch (err) {
                toast.error("Google registration failed");
            }
        },
        onError: () => {
            toast.error('Google Sign Up Failed');
        }
    });

    useEffect(() => {
        autohome();
    }, []);

    if (isLoading) {
        return <LoadingAnimation />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-deepGreen to-gradientLight text-cream relative overflow-hidden">
            {/* Background Elements */}
            <motion.img 
                src={leaf2} 
                alt="" 
                className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] opacity-20 -top-16 -right-8 sm:-right-16 lg:-right-36 rotate-180"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.2, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
            />
            <motion.img 
                src={leaf2} 
                alt="" 
                className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] opacity-20 -top-20 -left-8 sm:-left-12 lg:-left-24 rotate-90"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.2, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />

            <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

            <div className="flex min-h-screen justify-center items-center px-4 sm:px-6 lg:px-8 pt-20">
                <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
                    {/* Form Section */}
                    <motion.form 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col gap-6 w-full lg:w-1/2 border-2 shadow-lg shadow-darkBrown border-accentGreen p-6 sm:p-8 lg:p-10 rounded-xl bg-darkGreen/50 backdrop-blur-sm"
                        onSubmit={submitHandler}
                    >
                        <motion.h1 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream text-center"
                        >
                            Create Account
                        </motion.h1>

                        {/* Name Fields */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="flex-1"
                            >
                                <label htmlFor="firstname" className="text-cream flex flex-col gap-2 w-full">
                                    First Name *
                                    <input 
                                        type="text" 
                                        value={formData.firstname} 
                                        id="firstname" 
                                        name="firstname"
                                        className="flex justify-center text-cream text-sm items-center w-full border-2 border-accentGreen rounded-xl bg-darkGreen p-3 focus:outline-none focus:border-lightGreen transition-colors duration-200"
                                        onChange={changeHandler} 
                                    />
                                </label>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                                className="flex-1"
                            >
                                <label htmlFor="lastname" className="text-cream flex flex-col gap-2 w-full">
                                    Last Name *
                                    <input 
                                        type="text" 
                                        value={formData.lastname} 
                                        id="lastname" 
                                        name="lastname"
                                        className="flex justify-center text-cream text-sm items-center w-full border-2 border-accentGreen rounded-xl bg-darkGreen p-3 focus:outline-none focus:border-lightGreen transition-colors duration-200"
                                        onChange={changeHandler} 
                                    />
                                </label>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <label htmlFor="username" className="text-cream flex flex-col gap-2 w-full">
                                Username *
                                <input 
                                    type="text" 
                                    value={formData.username} 
                                    id="username" 
                                    name="username"
                                    className="flex justify-center text-cream text-sm items-center w-full border-2 border-accentGreen rounded-xl bg-darkGreen p-3 focus:outline-none focus:border-lightGreen transition-colors duration-200"
                                    onChange={changeHandler} 
                                />
                            </label>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                        >
                            <label htmlFor="email" className="text-cream flex flex-col gap-2 w-full">
                                Email *
                                <input 
                                    type="email" 
                                    value={formData.email} 
                                    id="email" 
                                    name="email"
                                    className="flex justify-center text-cream text-sm items-center w-full border-2 border-accentGreen rounded-xl bg-darkGreen p-3 focus:outline-none focus:border-lightGreen transition-colors duration-200"
                                    onChange={changeHandler} 
                                />
                            </label>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                        >
                            <label htmlFor="password" className="text-cream flex flex-col gap-2 w-full">
                                Password *
                                <div className="relative">
                                    <input 
                                        type={showpassword ? "text" : "password"} 
                                        onChange={changeHandler} 
                                        name="password" 
                                        id="password" 
                                        value={formData.password}
                                        className="flex justify-center text-cream text-sm items-center w-full border-2 border-accentGreen rounded-xl bg-darkGreen p-3 focus:outline-none focus:border-lightGreen transition-colors duration-200" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={passHandler} 
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cream hover:text-lightBrown transition-colors duration-200"
                                    >
                                        {showpassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </button>
                                </div>
                            </label>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 1.1 }}
                        >
                            <label htmlFor="confirmPassword" className="text-cream flex flex-col gap-2 w-full">
                                Confirm Password *
                                <div className="relative">
                                    <input 
                                        type={showconfirmPassword ? "text" : "password"} 
                                        onChange={changeHandler} 
                                        name="confirmPassword" 
                                        id="confirmPassword" 
                                        value={formData.confirmPassword}
                                        className="flex justify-center text-cream text-sm items-center w-full border-2 border-accentGreen rounded-xl bg-darkGreen p-3 focus:outline-none focus:border-lightGreen transition-colors duration-200" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={confirmPassHandler} 
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cream hover:text-lightBrown transition-colors duration-200"
                                    >
                                        {showconfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </button>
                                </div>
                            </label>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                            className="flex gap-2 items-center justify-center"
                        >
                            <span className="text-cream">Already have an account ?</span>
                            <NavLink to='/login' className='text-green-700 font-bold hover:text-lightBrown hover:scale-105 transition-all duration-200'>
                                Login
                            </NavLink>
                        </motion.div>

                        <motion.button 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 1.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting}
                            className="bg-accentGreen p-4 rounded-xl flex justify-center items-center text-cream hover:bg-darkBrown transition-all duration-200 shadow-lg shadow-darkBrown disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full"
                                />
                            ) : (
                                "Register"
                            )}
                        </motion.button>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.6 }}
                            className="flex items-center gap-2"
                        >
                            <span className="w-full h-[1px] bg-cream"></span>
                            <span className="flex text-sm text-cream">OR</span>
                            <span className="w-full h-[1px] bg-cream"></span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 1.8 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-accentGreen p-4 rounded-xl flex justify-center cursor-pointer items-center gap-4 text-cream hover:bg-darkBrown transition-all duration-200 shadow-lg shadow-darkBrown"
                            onClick={() => googleLogin()}
                        >
                            Sign Up with Google <FcGoogle />
                        </motion.div>
                    </motion.form>

                    {/* Info Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center p-8"
                    >
                        <motion.h1 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream mb-6"
                        >
                            AgriSetu
                        </motion.h1>
                        <motion.h2 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="text-lg sm:text-xl md:text-2xl text-cream max-w-md"
                        >
                            Ask AgriSetu | Increase your Productivity and Profits
                        </motion.h2>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default RegisterPage;