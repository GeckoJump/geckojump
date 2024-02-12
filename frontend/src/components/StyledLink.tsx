import { on } from 'events';
import React from 'react'

export interface StyledLinkedProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const StyledLink = ({ to, children, className, onClick}: StyledLinkedProps) => {
  const clickHandler = () => {
    onClick && onClick();
  }

  return (
    <a onClick={onClick} href={to} className={`group hover:cursor-pointer transition-all duration-300 ease-in-out ${className}`}>
      <span className='bg-left-bottom bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out'> 
        {children}
      </span>
    </a>
  )
}
