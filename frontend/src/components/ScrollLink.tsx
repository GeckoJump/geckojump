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
    <a onClick={scrollHere} className={`${isActive && 'text-bold'} ${className}`}>
      {children}
    </a>
  )
}