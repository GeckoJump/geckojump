
// StickyNavbar.tsx
import React, { useEffect } from 'react';
import { ScrollLink } from './ScrollLink';
import { useAuth } from '../AuthProvider';
import logo from '../logo.png'
import { Twirl } from 'hamburger-react';
import { Link } from 'react-router-dom';
import { StyledLink } from './StyledLink';

const StickyNavbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isNavOpen]);

  // Define the classes for links
  const NavLinkClasses = "text-zinc-300 font-semibold text-sm p-3 transition-all duration-150 ease-in"

  return (
    <nav className={`fixed flex transition-all duration-150 ${isNavOpen ? 'h-full [body]:overflow-y-hidden' : ''} justify-center w-full z-[999] bg-background bg-opacity-100 left-1/2 -translate-x-1/2 shadow-xl`}>
      <div className="container lg:w-3/5 w-3/4 py-3 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a className="z-[999]" href="#">
              <img src={logo} style={{filter: 'invert(49%) sepia(92%) saturate(379%) hue-rotate(110deg) brightness(96%) contrast(99%)'}} className='text-slate-900 dark:text-white w-auto h-8'/>
            </a>
          </div>
          <div className="absolute top-0 z-[998] left-0 w-1/3 justify-evenly">
            <div className={`flex flex-col gap-2 pt-10 items-center bg-background bg-opacity-100 fixed w-full h-full top-0 left-0 z-[1000] transform transition-all duration-300 ease-in-out ${isNavOpen ? 'translate-y-0' : '-translate-y-[100vh]'}`}>
              <ScrollLink to="hero-section" className={NavLinkClasses} onClick={() => setIsNavOpen(false)}>Home</ScrollLink>
              <ScrollLink to="values-section" className={NavLinkClasses} onClick={() => setIsNavOpen(false)}>About</ScrollLink>
              <ScrollLink to="software-services-section" className={NavLinkClasses} onClick={() => setIsNavOpen(false)}>Services</ScrollLink>
              <ScrollLink to="consulting-services-section" className={NavLinkClasses} onClick={() => setIsNavOpen(false)}>Consulting</ScrollLink>
              <ScrollLink to="contact-section" className={NavLinkClasses} onClick={() => setIsNavOpen(false)}>Contact</ScrollLink>
              {isAuthenticated ? 
                <button onClick={logout} className={NavLinkClasses}>Logout</button> :
                <Link to="/login" className={NavLinkClasses} onClick={() => setIsNavOpen(false)}>Login</Link>}
            </div>
          </div>
          {/* Hamburger Menu when small, normal nav when large */}
          <div className="flex w-1/3 z-[999] justify-end justify-self-end lg:hidden">
            <Twirl size={24} color="#fff" toggled={isNavOpen} toggle={setIsNavOpen} />
          </div>
          <div className="hidden w-1/3 justify-evenly lg:flex">
          <ScrollLink to="hero-section" className={NavLinkClasses} onClick={() => setIsNavOpen(false)}>Home</ScrollLink>
              <ScrollLink to="values-section" className={NavLinkClasses} onClick={() => setIsNavOpen(false)}>About</ScrollLink>
              <ScrollLink to="software-services-section" className={NavLinkClasses} onClick={() => setIsNavOpen(false)}>Services</ScrollLink>
              <ScrollLink to="consulting-services-section" className={NavLinkClasses} onClick={() => setIsNavOpen(false)}>Consulting</ScrollLink>
              <ScrollLink to="contact-section" className={NavLinkClasses} onClick={() => setIsNavOpen(false)}>Contact</ScrollLink>
              {isAuthenticated ? 
                <button onClick={logout} className={NavLinkClasses}>Logout</button> :
                <StyledLink to="/login" className={NavLinkClasses} onClick={() => setIsNavOpen(false)}>Login</StyledLink>}
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



