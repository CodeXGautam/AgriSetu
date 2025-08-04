import { NavLink } from "react-router-dom"

const Footer = () => {
    return (
        <div className="flex flex-col gap-5 mt-20 mb-2 bg-darkGreen p-6">

            <div className="flex text-cream justify-evenly items-center text-md">
                <NavLink to='/product' className='hover:text-lightBrown'>
                    Product
                </NavLink>

                <NavLink to='/pricing' className='hover:text-lightBrown'>
                    Pricing
                </NavLink>

                <NavLink to='/resources' className='hover:text-lightBrown'>
                    Resources
                </NavLink>

                <NavLink to='/contact' className='hover:text-lightBrown'>
                    Contact Us
                </NavLink>
            </div>

            <div className="text-cream text-sm text-center">
                ©️ 2025 AgriSetu | All rights reserved
            </div>

        </div>
    )
}

export default Footer;