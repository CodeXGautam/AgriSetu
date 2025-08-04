import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const Navbar = (props) => {

    const loggedIn = props.loggedIn;
    const setLoggedIn = props.setLoggedIn;
    const navigate = useNavigate();

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


    return (
        <div className="flex justify-between bg-slate-950 p-3 w-[90%] mx-auto border-b-2 border-blue-700">
            <Link to='/' className="flex justify-center items-center text-2xl font-extrabold text-gray-200 hover:text-white 
        cursor-pointer">
                Vocintera
            </Link>

            <div className='flex gap-8 text-md items-center text-gray-200'>
                {
                    !loggedIn &&
                    <NavLink to='/product' className='hover:bg-gray-900 p-2 rounded-xl hidden md:flex lg:flex xl:flex 2xl:flex'>
                        Product
                    </NavLink>
                }

                {
                    !loggedIn &&
                    <NavLink to='/pricing' className='hover:bg-gray-900 p-2 rounded-xl hidden md:flex lg:flex xl:flex 2xl:flex'>
                        Pricing
                    </NavLink>
                }

                {
                    !loggedIn &&
                    <NavLink to='/resources' className='hover:bg-gray-900 p-2 rounded-xl hidden md:flex lg:flex xl:flex 2xl:flex'>
                        Resources
                    </NavLink>
                }
              
                {
                    !loggedIn &&
                    <NavLink to='/register' className='flex justify-center items-center bg-blue-700 p-2 
                    rounded-xl hover:bg-blue-600 hover:scale-[1.05] duration-[1s]'>
                        Get Started
                    </NavLink>
                }

                {/* when user logged in  */}

                 {
                    loggedIn &&
                    <NavLink to='/home' className='hover:bg-gray-900 p-2 rounded-xl'>
                      Home
                    </NavLink>
                }

                {
                    loggedIn &&
                    <NavLink to='/practice' className='hover:bg-gray-900 p-2 rounded-xl hidden md:flex lg:flex xl:flex 2xl:flex'>
                      Practice
                    </NavLink>
                }

                {
                    loggedIn &&
                    <button className='hover:bg-gray-900 hover:scale-[1.1] p-2 rounded-xl 
                    text-blue-700 font-semibold' onClick={logOutHandler}>
                      LogOut
                    </button>
                }
            </div>
        </div>
    )
}

export default Navbar;