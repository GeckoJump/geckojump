import React from 'react'
import logo from '../logo.png'

const NavLinkClasses = "text-zinc-200 p-3 transition-all duration-300 ease-in-out hover:font-bold"

// Stick the navbar to the top of the page, when the user scrolls
// it should stick to the top of the page and become opaque
export const StickyNavbar = () => {
  
  return (
    <nav className="fixed flex justify-center w-full z-[999] bg-background bg-opacity-100 left-1/2 -translate-x-1/2 shadow-xl">
      <div className="container w-3/5 py-3 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a className="" href="#">
              <img src={logo} style={{filter: 'invert(49%) sepia(92%) saturate(379%) hue-rotate(110deg) brightness(96%) contrast(99%)'}} className='text-slate-900 dark:text-white w-auto h-8'/>
            </a>
          </div>
          <div className="flex w-1/3 justify-evenly">
            <a className={NavLinkClasses} href="#">
              Home
            </a>
            <a className={NavLinkClasses} href="#">
              About
            </a>
            <a className={NavLinkClasses} href="#">

              Services
            </a>
            <a className={NavLinkClasses} href="#">

              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
    )
}
