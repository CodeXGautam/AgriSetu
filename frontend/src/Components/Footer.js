import { NavLink } from "react-router-dom"

const Footer = () => {
    return (
        <div className="flex flex-col gap-4 mt-20 mb-2">

            <div className="flex text-gray-400 justify-evenly items-center text-md">
                <NavLink to='/product' className='hover:text-gray-300'>
                    Product
                </NavLink>

                <NavLink to='/pricing' className='hover:text-gray-300'>
                    Pricing
                </NavLink>

                <NavLink to='/resources' className='hover:text-gray-300'>
                    Resources
                </NavLink>

                <NavLink to='/contact' className='hover:text-gray-300'>
                    Contact Us
                </NavLink>
            </div>

            <div className="text-gray-400 text-sm text-center">
                ©️ 2025 Vocintera | All rights reserved
            </div>

        </div>
    )
}

export default Footer;