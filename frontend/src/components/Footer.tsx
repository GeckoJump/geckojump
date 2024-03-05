import React from 'react'
import { ScrollLink } from './ScrollLink'


export const Footer = () => {
  return (
    <div className="flex justify-center w-full bg-background py-10">
      <div className="container flex flex-col w-3/5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ScrollLink to="hero-section" className="text-lg font-semibold text-white" disableUnderline>Home</ScrollLink>
          <ScrollLink to="values-section" className="text-lg font-semibold text-white" disableUnderline>Our Values</ScrollLink>
          <ScrollLink to="software-services-section" className="text-lg font-semibold text-white" disableUnderline>Software Services</ScrollLink>
          <ScrollLink to="consulting-services-section" className="text-lg font-semibold text-white" disableUnderline>Consulting Services</ScrollLink>
          <ScrollLink to="contact-section" className="text-lg font-semibold text-white" disableUnderline>Contact</ScrollLink>

        </div>
        <div className='divider w-full my-4 bg-gray-500'></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">GeckoJump™</a>. All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">About</a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
          </li>
          <li>
            <a href="#" className="hover:underline">Contact</a>
          </li>
        </ul>
      </div>
    </div>

  )
}
