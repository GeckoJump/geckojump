import React from 'react'
import logo from '../logo.png'

// Stick the navbar to the top of the page, when the user scrolls
// it should stick to the top of the page and become opaque
export const StickyNavbar = () => {
  
  return (
    <nav className="fixed flex justify-center w-full z-[999] bg-background bg-opacity-100 left-1/2 -translate-x-1/2">
      <div className="container w-3/5 py-3 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a className="" href="#">
              <img src={logo} style={{filter: 'invert(49%) sepia(92%) saturate(379%) hue-rotate(110deg) brightness(96%) contrast(99%)'}} className='text-slate-900 dark:text-white w-auto h-8'/>
            </a>
          </div>
          <div className="flex items-center gap-x-5">
            <a className="text-white hover:text-gray-200" href="#">
              Home
            </a>
            <a className="text-white hover:text-gray-200" href="#">
              About
            </a>
            <a className="text-white hover:text-gray-200" href="#">

              Services
            </a>
            <a className="text-white hover:text-gray-200" href="#">

              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
    )
}
