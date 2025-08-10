import { IoHome } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { RiMenuUnfold2Line } from "react-icons/ri";
import { RiMenuUnfoldLine } from "react-icons/ri";
import { NavLink, useNavigate } from 'react-router';
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { 
    FaRobot, 
    FaLeaf, 
    FaNewspaper, 
    FaStore, 
    FaCamera, 
    FaChartLine,
    FaSignOutAlt,
    FaUserCircle
} from 'react-icons/fa';

const Sidebar = (props) => {
    const setLoggedIn = props.setLoggedIn;
    const [menuBar, setMenuBar] = useState(true);
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        image: '',
    });

    const fetchUserInfo = async () => {
        try {
            const res = await fetch(process.env.REACT_APP_BACKEND_URI + '/getUser', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
            const user = data.user;

            setUserInfo({
                username: user.firstname,
                email: user.email,
                image: user.avatar,
            })

        } catch (error) {
            console.log("Error: ", error);
        }
    }

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const navigate = useNavigate();

    const menuHandler = () => {
        if (menuBar === true) {
            document.querySelector('.menu').classList.add('transform', 'translate-x-[-80%]', 'bg-transparent',);
            document.querySelector('.menu-icon').classList.add('bg-accentGreen', 'text-white', 'p-2', 'rounded-full')
            document.querySelector('.menu').classList.remove('shadow-md');
            document.querySelector('.menu-items').classList.remove('active');
            setMenuBar(false);
        }
        else if (menuBar === false) {
            document.querySelector('.menu').classList.remove('transform', 'translate-x-[-80%]', 'bg-transparent');
            document.querySelector('.menu-icon').classList.remove('bg-accentGreen', 'text-white', 'p-2', 'rounded-full')
            document.querySelector('.menu').classList.add('shadow-md');
            document.querySelector('.menu-items').classList.add('active');
            setMenuBar(true);
        }
    }

    const logoutHandler = async () => {
        try {
            await fetch(process.env.REACT_APP_BACKEND_URI + '/logout', {
                method: 'GET',
                credentials: 'include',
            })
                .then(response => response.json())
                .then(response => {
                    if (response.message === "User not found") {
                        toast.error("User not found");
                        return;
                    }

                    if (response.message === "Logged out successfully") {
                        toast.success("Logged out successfully");
                        navigate('/');
                        setLoggedIn(false);
                    }
                })
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    const menuItems = [
        { to: '/home', icon: <IoHome />, label: 'Home', color: 'text-blue-400' },
        { to: '/chatbot', icon: <FaRobot />, label: 'AI Chatbot', color: 'text-green-400' },
        { to: '/disease-detection', icon: <FaCamera />, label: 'Disease Detection', color: 'text-red-400' },
        { to: '/crops-prediction', icon: <FaLeaf />, label: 'Crop Recommendations', color: 'text-emerald-400' },
        { to: '/analytics', icon: <FaChartLine />, label: 'Analytics', color: 'text-yellow-400' },
        { to: '/marketplace', icon: <FaStore />, label: 'Marketplace', color: 'text-purple-400' },
        { to: '/agri-news', icon: <FaNewspaper />, label: 'Agriculture News', color: 'text-orange-400' },
        { to: '/settings', icon: <IoSettingsOutline />, label: 'Settings', color: 'text-gray-400' },
    ];

    const SidebarContent = ({ isMobile = false }) => (
        <div className={`flex flex-col gap-3 w-[100%] h-full overflow-y-auto scrollbar-hide ${isMobile ? 'menu-items' : ''}`}>
            {/* Header */}
            <div className="flex justify-between items-center w-[100%] mb-3">
                <h1 className='text-cream font-extrabold text-2xl sm:text-3xl flex items-center justify-center'>
                    AgriSetu
                </h1>

                {isMobile && (
                    <div 
                        className="flex justify-center items-center text-xl text-cream hover:text-accentGreen cursor-pointer menu-icon p-2 rounded-full hover:bg-accentGreen/20 transition-all duration-300" 
                        onClick={menuHandler}
                    >
                        {menuBar ? <RiMenuUnfold2Line /> : <RiMenuUnfoldLine />}
                    </div>
                )}
            </div>

            {/* User Profile */}
            <div className="flex justify-start items-center gap-3 p-3 bg-darkGreen/30 rounded-lg border border-accentGreen/10">
                <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-r from-accentGreen to-lightGreen shadow-md shadow-accentGreen/20 flex items-center justify-center overflow-hidden">
                    {userInfo.image ? (
                        <img src={userInfo.image} alt="user avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <FaUserCircle className="text-white text-2xl" />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-cream font-medium text-sm">
                        Hi, {userInfo.username || 'User'}
                    </span>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-1 flex-1">
                {menuItems.map((item, index) => (
                    <div key={item.to}>
                        <NavLink 
                            to={item.to} 
                            className={({ isActive }) => `
                                flex justify-start items-center text-cream hover:text-lightBrown
                                rounded-lg p-2.5 cursor-pointer w-[100%] gap-3 transition-all duration-300
                                ${isActive 
                                    ? 'bg-gradient-to-r from-accentGreen to-lightGreen text-white shadow-md shadow-accentGreen/20' 
                                    : 'hover:bg-accentGreen/10 hover:shadow-sm'
                                }
                            `}
                        >
                            <div className={`text-lg ${item.color}`}>
                                {item.icon}
                            </div>
                            <span className="font-medium text-sm">{item.label}</span>
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="">
            {/* Mobile view sidebar */}
            <div className="menu w-[23%] min-w-[240px] fixed left-0 top-0 h-screen bg-gradient-to-b from-darkGreen to-darkGreen/95 p-4 rounded-md flex flex-col justify-between items-center shadow-xl shadow-darkBrown md:hidden lg:hidden xl:hidden 2xl:hidden transition-all duration-300 ease-in-out z-[1000] border-r border-accentGreen/20">
                <div className="flex-1 w-full overflow-hidden">
                    <SidebarContent isMobile={true} />
                </div>

                <button 
                    className="flex justify-center items-center text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg p-2.5 cursor-pointer w-[100%] gap-2 font-medium transition-all duration-300 border border-red-500/20 hover:border-red-400/30 text-sm"
                    onClick={logoutHandler}
                >
                    <FaSignOutAlt className="text-base" />
                    Logout
                </button>
            </div>

            {/* Desktop view Sidebar */}
            <div className="w-[25%] min-w-[220px] h-screen bg-gradient-to-b from-darkGreen to-darkGreen/95 p-4 rounded-md flex-col justify-between items-center shadow-xl shadow-darkBrown hidden md:flex lg:flex xl:flex 2xl:flex transition-all duration-300 ease-in-out border-r border-accentGreen/20">
                <div className="flex-1 w-full overflow-hidden">
                    <SidebarContent />
                </div>

                <button 
                    className="flex justify-center items-center text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg p-2.5 cursor-pointer w-[100%] gap-2 font-medium transition-all duration-300 border border-red-500/20 hover:border-red-400/30 text-sm"
                    onClick={logoutHandler}
                >
                    <FaSignOutAlt className="text-base" />
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Sidebar;