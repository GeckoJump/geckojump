import { on } from "events";
import { useRef, useState } from "react";

export interface ScrollLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  block?: 'start' | 'center' | 'end' | 'nearest';
  disableUnderline?: boolean;
}

export const ScrollLink = ({ to, children, block, className, onClick, disableUnderline = false }: ScrollLinkProps) => {
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
      <span className={!disableUnderline ? 'bg-left-bottom bg-gradient-to-r from-slate-300 to-slate-300 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out' : ''}> 
        {children}
      </span>
    </a>
  )
}