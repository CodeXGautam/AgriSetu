import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const LandingPage = (props) => {

    const loggedIn = props.loggedIn;
    const setLoggedIn = props.setLoggedIn;

    const navigate = useNavigate()

    const clickHandler = () => {
        navigate('/register');
    }

    return (
        <div className="flex flex-col text-gray-300 justify-center text-center mx-auto w-full gap-10 p-5">
            <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            <div className='flex w-[100%] p-5 justify-evenly'>
                <div className='flex flex-col justify-center items-center gap-3 w-[80%]'>
                    <h1 className='flex justify-center items-center font-bold text-blue-400 text-3xl'>Grow Smart</h1>
                    <h1 className='flex justify-center items-center font-bold text-blue-400 text-3xl'>Increase your Productivity and Profits</h1>
                    <span className='flex text-gray-300 text-lg'>AI enabled crops prediction</span>
                    <span className='flex text-gray-300 text-lg'>Get the best crops for your land</span>
                    <button className='bg-blue-700 text-gray-300 p-4 rounded-xl hover:bg-blue-800 transition-all 
                    duration-300 shadow-md shadow-blue-500'
                        onClick={clickHandler}>
                        Get Started
                    </button>
                </div>
            </div>

            {/* <div className='h-[2px] w-full bg-blue-950'></div> */}

            <div className='flex flex-col justify-center gap-5 mt-20 border-l-2 border-t-2 border-blue-950
             rounded-xl p-20'>
                <div className='text-5xl font-bold text-blue-400'>Multiple Domains</div>
                <div className='flex justify-center items-center text-lg text-gray-400'>Choose from different
                    Domains</div>
            </div>

            <div className='flex justify-center items-center relative w-[100%] border-r-2 border-b-2 
            border-blue-950 p-20 rounded-xl'>

                <img src='https://cdn.prod.website-files.com/61a05ff14c09ecacc06eec05/6720e94e1cd203b14c045522_%20Interview-Notes.jpg'
                    alt='' className='w-[70%] min-w-[350px] opacity-[0.2] rounded-xl shadow-xl shadow-blue-700' />
                <div className='absolute m-auto h-[100%] flex flex-col gap-3 justify-center items-center z-[10]'>
                    <h1 className='text-4xl text-white font-bold'>Ace your Productivity ans yeild</h1>
                    <p className='text-sm font-semibold'>AI enabled personalised crops personalised and disease detection</p>
                    <button className='bg-blue-700 text-gray-300 p-4 rounded-xl hover:bg-blue-800 transition-all 
                    duration-300 shadow-md shadow-blue-500 font-bold' onClick={clickHandler}>
                        Get Started</button>
                </div>
            </div>

        <Footer/>
        </div>
    )
}

export default LandingPage;