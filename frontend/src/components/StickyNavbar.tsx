
// StickyNavbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import logo from '../logo.png'

const StickyNavbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  // Define the classes for links
  const NavLinkClasses = "text-zinc-200 p-3 transition-all duration-300 ease-in-out hover:font-bold"

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
            <Link to="/" className={NavLinkClasses}>Home</Link>
            <Link to="/about" className={NavLinkClasses}>About</Link>
            <Link to="/services" className={NavLinkClasses}>Services</Link>
            <Link to="/contact" className={NavLinkClasses}>Contact</Link>
            {!isAuthenticated ? (
              <Link to="/api/login" className={NavLinkClasses}>Login</Link>
            ) : (
              <>
                <Link to="/dashboard" className={NavLinkClasses}>Dashboard</Link>
                <button className={NavLinkClasses} onClick={logout}>Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StickyNavbar;








// import React, { useState } from 'react'
// import logo from '../logo.png'

// const NavLinkClasses = "text-zinc-200 p-3 transition-all duration-300 ease-in-out hover:font-bold"

// // Stick the navbar to the top of the page, when the user scrolls
// // it should stick to the top of the page and become opaque
// export const StickyNavbar = () => {
//   const [isNavOpen, setIsNavOpen] = useState(false);
  
//   return (
//     <nav className="fixed flex justify-center w-full z-[999] bg-background bg-opacity-100 left-1/2 -translate-x-1/2 shadow-xl">
//       <div className="container w-3/5 py-3 ">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <a className="" href="#">
//               <img src={logo} style={{filter: 'invert(49%) sepia(92%) saturate(379%) hue-rotate(110deg) brightness(96%) contrast(99%)'}} className='text-slate-900 dark:text-white w-auto h-8'/>
//             </a>
//           </div>
//           <div className="flex w-1/3 justify-evenly">
//             <a className={NavLinkClasses} href="#">
//               Home
//             </a>
//             <a className={NavLinkClasses} href="#">
//               About
//             </a>
//             <a className={NavLinkClasses} href="#">

//               Services
//             </a>
//             <a className={NavLinkClasses} href="#">

//               Contact
//             </a>
//           </div>
//         </div>
//       </div>
//     </nav>
//     )
// }



