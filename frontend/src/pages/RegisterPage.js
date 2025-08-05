import { useEffect, useState } from "react";
import { NavLink, useNavigate } from 'react-router';
import { FcGoogle } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { toast } from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google';
import leaf2 from '../images/leaf2.png';

const RegisterPage = (props) => {

    const loggedIn = props.loggedIn;
    const setLoggedIn = props.setLoggedIn;

    const navigate = useNavigate();


    const autohome = () => {
        if (loggedIn) {
            navigate('/home');
        }
    }

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const changeHandler = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            if (!formData.firstname || !formData.lastname || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
                toast.error("All fields are required");
                return;
            };

            if (formData.password.length < 6) {
                toast.error("Password must be at least 6 characters long");
                setFormData({
                    ...formData,
                    password: '',
                    confirmPassword: ''
                });
                return;
            };

            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }

            else {
                await fetch(process.env.REACT_APP_BACKEND_URI + '/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(
                        formData
                    )
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
                            })
                            toast.error("User already exists");
                            return;
                        }

                        else if (response.message === "Password must be at least 6 characters long") {
                            console.log('Error: ', response.message);
                            toast.error("Password must be at least 6 characters long");
                            return;
                        }

                        else if (response.message === "User registration failed") {
                            console.log('Error:', response.message);
                            toast.error("User registration failed");
                            return;
                        }

                        else if (response.message === "Internal server error") {
                            console.error('Error:', response.message);
                            toast.error("Failed to create user. Please try again.");
                            return;
                        }

                        else if (response.message === "User registered successfully") {
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
                    })
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Registration failed. Please try again.");
        }
    }

    const [showpassword, setShowPassword] = useState(false);
    const [showconfirmPassword, setShowConfirmPassword] = useState(false);

    const passHandler = () => {
        setShowPassword(!showpassword)
    }

    const confirmPassHandler = () => {
        setShowConfirmPassword(!showconfirmPassword)
    }

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
    }, [])

    return (
        <div className="flex flex-col mt-5 overflow-hidden">
            <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            <div className="flex min-h-screen justify-center items-center gap-10 p-10 w-[100%] min-w-[300px]
            bg-gradient-to-r from-deepGreen to-gradientLight text-cream relative">
                <img src={leaf2} alt="" className="absolute w-[400px] h-[400px] opacity-20 -top-36 -right-36 rotate-180" />
                <img src={leaf2} alt="" className="absolute w-[400px] h-[400px] opacity-20 -top-56 -left-24 rotate-90" />
                <form className="flex flex-col gap-4 w-[80%] sm:w-[80%] md:w-[50%] lg:w-[100%] border-2 shadow-md shadow-darkBrown 
            border-accentGreen p-10 rounded-xl min-w-[300px] z-10" onSubmit={submitHandler}>

                    <div className="flex flex-col justify-between gap-3 items-center w-[100%] lg:flex-row lg:gap-4">
                        <label htmlFor="Firstname" className="text-gray-300 flex flex-col gap-2 w-[100%]">Firstname *
                            <input type="text" value={formData.firstname} id="firstname" name="firstname"
                                className="flex justify-center text-cream text-sm items-center w-[100%] border-2 border-accentGreen rounded-xl bg-darkGreen p-3"
                                onChange={changeHandler} />
                        </label>
                        <label htmlFor="Lastname" className="text-gray-300 flex flex-col gap-2 w-[100%]">Lastname *
                            <input type="text" value={formData.lastname} id="lastname" name="lastname"
                                className="flex justify-center text-cream text-sm items-center w-[100%] border-2 border-accentGreen rounded-xl bg-darkGreen p-3"
                                onChange={changeHandler} />
                        </label>
                    </div>

                    <label htmlFor="Username" className="text-gray-300 flex flex-col gap-2 w-[100%]">Username *
                        <input type="text" value={formData.username} id="username" name="username"
                            className="flex justify-center text-cream text-sm items-center w-[100%] border-2 border-accentGreen rounded-xl bg-darkGreen p-3"
                            onChange={changeHandler} />
                    </label>

                    <label htmlFor="Email" className="text-gray-300 flex flex-col gap-2 w-[100%]">Email *
                        <input type="email" value={formData.email} id="email" name="email"
                            className="flex justify-center text-cream text-sm items-center w-[100%] border-2 border-accentGreen rounded-xl bg-darkGreen p-3"
                            onChange={changeHandler} />
                    </label>
                    <label htmlFor="Password" className="text-cream flex flex-col gap-2 w-[100%]">
                        Password *
                        {!showpassword &&
                            <div className="relative">
                                <input type="password" onChange={changeHandler} name="password" id="password" value={formData.password}
                                    className="flex justify-center text-cream text-sm items-center w-[100%] border-2 border-accentGreen rounded-xl bg-darkGreen p-3" />
                                <FaRegEyeSlash onClick={passHandler} className="absolute right-4 bottom-4" />
                            </div>
                        }

                        {showpassword &&
                            <div className='relative'>
                                <input type="text" onChange={changeHandler} name="password" id="password" value={formData.password}
                                    className="flex justify-center text-cream text-sm items-center w-[100%] border-2 border-accentGreen rounded-xl bg-darkGreen p-3" />
                                <FaRegEye onClick={passHandler} className="absolute right-4 bottom-4" />
                            </div>
                        }
                    </label>

                    <label htmlFor="Confirm Password" className="text-cream flex flex-col gap-2 w-[100%]">
                        Confirm Password *
                        {!showconfirmPassword &&
                            <div className="relative">
                                <input type="password" onChange={changeHandler} name="confirmPassword" id="confirmPassword" value={formData.confirmPassword}
                                    className="flex justify-center text-cream text-sm items-center w-[100%] border-2 border-accentGreen rounded-xl bg-darkGreen p-3" />
                                <FaRegEyeSlash onClick={confirmPassHandler} className="absolute right-4 bottom-4" />
                            </div>
                        }

                        {showconfirmPassword &&
                            <div className='relative'>
                                <input type="text" onChange={changeHandler} name="confirmPassword" id="confirmPassword" value={formData.confirmPassword}
                                    className="flex justify-center text-cream text-sm items-center w-[100%] border-2 border-accentGreen rounded-xl bg-darkGreen p-3" />
                                <FaRegEye onClick={confirmPassHandler} className="absolute right-4 bottom-4" />
                            </div>
                        }
                    </label>


                    <div className="flex gap-2 items-center">
                        <span className="text-cream">Already have an account ?</span>
                        <NavLink to='/login' className='text-green-700 font-bold hover:text-lightBrown hover:scale-[1.05]'>Login</NavLink>
                    </div>

                    <button className="bg-accentGreen p-4 rounded-xl flex justify-center items-center text-cream 
                hover:bg-darkBrown transition-all duration-200 hover:scale-[1.05] hover:text-cream shadow-lg shadow-darkBrown">
                        Register
                    </button>

                    <div className="flex items-center justytify-center gap-2">
                        <span className="w-[100%] h-[1px] bg-cream"></span>
                        <span className="flex text-sm text-cream">OR</span>
                        <span className="w-[100%] h-[1px] bg-cream"></span>
                    </div>

                    <div
                        className="bg-accentGreen p-4 rounded-xl flex justify-center cursor-pointer items-center gap-4 text-cream \
                        hover:bg-darkBrown transition-all duration-200 hover:scale-[1.05] hover:text-cream shadow-lg shadow-darkBrown"
                        onClick={() => googleLogin()}
                    >
                        Sign Up with Google <FcGoogle />
                    </div>
                </form>

                <div className="w-[100%] hidden sm:hidden md:flex lg:flex xl:flex 2xl:flex flex-col items-center justify-center">
                    <h1 className="text-4xl">AgriSetu</h1>

                    <h2 className='text-cream flex justify-center items-center'>
                        Ask AgriSetu | Increase your Productivity and Profits
                    </h2>
                </div>
            </div >

            <Footer />
        </div>
    )
}

export default RegisterPage;