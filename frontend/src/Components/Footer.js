import { NavLink } from "react-router-dom";
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <motion.footer 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-darkGreen p-6 mt-20"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Navigation Links */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center md:justify-start gap-6 text-cream text-sm"
                    >
                        <NavLink to='/product' className='hover:text-lightBrown transition-colors duration-200'>
                            Product
                        </NavLink>
                        <NavLink to='/pricing' className='hover:text-lightBrown transition-colors duration-200'>
                            Pricing
                        </NavLink>
                        <NavLink to='/resources' className='hover:text-lightBrown transition-colors duration-200'>
                            Resources
                        </NavLink>
                        <NavLink to='/contact' className='hover:text-lightBrown transition-colors duration-200'>
                            Contact Us
                        </NavLink>
                    </motion.div>

                    {/* Copyright */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-cream text-sm text-center md:text-right"
                    >
                        ©️ 2025 AgriSetu | All rights reserved
                    </motion.div>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;