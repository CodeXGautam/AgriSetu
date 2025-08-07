import { BiSolidDashboard } from "react-icons/bi";
import { useNavigate } from 'react-router';
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";




const Home = (props) => {

    const loggedIn = props.loggedIn;
    const setLoggedIn = props.setLoggedIn;
    const navigate = useNavigate();

    return (
        <div className="flex w-full min-h-screen relative gap-4 overflow-hidden  bg-gradient-to-r from-deepGreen to-gradientLight text-cream">
            <Sidebar loggedIn = {loggedIn} setLoggedIn = {setLoggedIn}/>

            <div className="w-full max-h-screen bg-darkGreen flex flex-col gap-8 transition-all
            duration-300 ease-in-out rounded-md shadow-md shadow-darkBrown p-5 overflow-y-scroll">

                <h1 className="flex gap-2 justify-start items-center text-cream font-semibold text-3xl hover:text-lightBrown transition duration-300">
                    <BiSolidDashboard /> Dashboard
                </h1>
                <Footer />
            </div>

        </div>
    )
}

export default Home;