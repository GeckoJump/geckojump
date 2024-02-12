import { on } from "events";
import { useRef, useState } from "react";

export interface ScrollLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  block?: 'start' | 'center' | 'end' | 'nearest';
}

export const ScrollLink = ({ to, children, block, className, onClick }: ScrollLinkProps) => {
  const scrollHere = () => {
    const element = document.getElementById(to);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: block ?? 'start' });
    }
    onClick && onClick(); // Call the onClick prop if it exists
  }

  const [isActive, setIsActive] = useState(false);


  return (
    <a onClick={scrollHere} className={`group hover:cursor-pointer transition-all duration-300 ease-in-out ${className}`}>
      <span className='bg-left-bottom bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out'> 
        {children}
      </span>
    </a>
  )
}