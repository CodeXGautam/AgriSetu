import { useState ,useEffect } from "react";
import { NavLink, useNavigate } from 'react-router';
import { FcGoogle } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import toast from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google';
import leaf2 from '../images/leaf2.png';


const LoginPage = (props) => {

   const navigate = useNavigate();

   const loggedIn = props.loggedIn;
   const setLoggedIn = props.setLoggedIn;

   const [showpassword, setShowPassword] = useState(false);

   const autohome = () =>{
      if(loggedIn){
         navigate('/home');
      }
   }

   const [formData, setFormData] = useState({
      email: '',
      password: '',
   })

   const passHandler = () => {
      setShowPassword(!showpassword)
   }

   const changeHandler = (event) => {
      setFormData({
         ...formData,
         [event.target.name]: event.target.value
      })
   }

   const submitHandler = async (event) => {
      event.preventDefault();
     try {
      if(!formData.email || !formData.password){
         toast.error("All fields are required");
         return;
      }

      if(formData.password.length <6){
         toast.error("Password must be at least 6 characters long");
         return;
      }

      await fetch(process.env.REACT_APP_BACKEND_URI + '/login', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         credentials: 'include',
         body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(response => {
         if(response.message === "Invalid credentials"){
            toast.error("Invalid credentials");
         }
         else if(response.message === "User not found"){
            toast.error("User not found");
         }
         else if(response.message === "Login successful"){
            console.log('i am clicked');
            toast.success("User logged In");
            setLoggedIn(true);
            navigate('/home')
         }
      })
     } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
     }
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
               toast.success("Logged in with Google!");
               navigate('/home');
            } else {
               toast.error(data.message || "Google login failed");
            }
         } catch (err) {
            toast.error("Google login failed");
         }
      },
      onError: () => {
         toast.error('Google Login Failed');
      }
   });

   useEffect(()=>{
      autohome();
   },[])


   return (
      <div className="flex flex-col bg-gradient-to-r from-deepGreen to-gradientLight text-cream mt-5 relative overflow-hidden">
         <img src={leaf2} alt="" className="absolute w-[400px] h-[400px] opacity-20 -top-16 -right-44 rotate-180"/>
         <img src={leaf2} alt="" className="absolute w-[400px] h-[400px] opacity-20 -top-28 -left-24 rotate-90"/>

         <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

         <div className='flex min-h-screen justify-center items-center'>
            <form className='flex flex-col gap-5 border-2 shadow-md shadow-darkBrown w-[70%] max-w-[600px]
            border-accentGreen p-10 rounded-xl min-w-[300px]' onSubmit={submitHandler}>

               <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cream text-center'>Welcome Back !</h1>

               <label htmlFor="Email" className="text-cream flex flex-col gap-2 w-[100%]">Email *
                  <input type="email" value={formData.email} id="email" name="email"
                     className="flex justify-center text-cream text-sm items-center border-2 border-accentGreen rounded-xl bg-darkGreen p-3"
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

               <div className="flex gap-2 items-center">
                  <span className="text-cream">Do not have an account ?</span>
                  <NavLink to='/register' className='text-green-700 font-bold hover:text-lightBrown hover:scale-[1.05]'>
                     Register
                  </NavLink>
               </div>

               <button className="bg-accentGreen p-4 rounded-xl flex justify-center items-center text-cream 
                hover:bg-darkBrown transition-all duration-200 hover:scale-[1.05] shadow-lg shadow-darkBrown">
                  Log In
               </button>

               <div className="flex items-center gap-2">
                  <span className="w-[100%] h-[1px] bg-cream"></span>
                  <span className="flex text-sm text-cream">OR</span>
                  <span className="w-[100%] h-[1px] bg-cream"></span>
               </div>

               <div
                  className="bg-accentGreen p-4 rounded-xl flex justify-center cursor-pointer items-center gap-4 text-cream \
                     hover:bg-darkBrown transition-all duration-200 hover:scale-[1.05] shadow-lg shadow-darkBrown"
                  onClick={() => googleLogin()}
               >
                  Log In with Google <FcGoogle />
               </div>
            </form>
         </div>
      
         <Footer/>
      </div>
   )
}

export default LoginPage;