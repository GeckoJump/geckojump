import React from 'react'

// Stick the navbar to the top of the page, when the user scrolls
// it should stick to the top of the page and become opaque
export const StickyNavbar = () => {
  
  return (
    <nav className="fixed flex justify-center z-100 w-full bg-background left-1/2 -translate-x-1/2">
      <div className="container w-3/5 py-3 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a className="text-white text-xl font-bold md:text-2xl hover:text-gray-200" href="#">
              Brand
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
