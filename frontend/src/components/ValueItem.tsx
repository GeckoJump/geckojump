import React, { useState } from 'react'
import { FaArrowAltCircleRight, FaCarrot, FaCompressArrowsAlt, FaLongArrowAltRight } from 'react-icons/fa'
import { GoArrowRight } from 'react-icons/go'
import { IoIosArrowDropright, IoMdArrowDropright } from 'react-icons/io'
import { RiArrowRightSLine, RiGhost2Fill } from 'react-icons/ri'

interface ValueItemProps {
  index: number
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  onFocus?: (index: number) => void
  className?: string
}

export const ValueItem = ({ index, title, description, icon, subtitle, className, onFocus }: ValueItemProps) => {
  const [isActive, setIsActive] = useState(false)

  if (onFocus && index === undefined) {
    console.error('ValueItem: onFocus prop is defined but index is not')
  }

  return (
    <div id={`value-item-${index}`} className={`grid col-span-1 grid-rows-[1fr_2fr_2fr] p-6 max-w-[300px] mx-auto bg-white shadow-xl shadow-slate-300 hover:shadow-slate-400 transition-all duration-100 rounded-lg ${className}`}>
      <header>
        <h3 className="text-xl font-semibold tracking-wide pb-0 text-left">{title}</h3>
        <h4 className="text-md font-normal text-slate-500 pb-2 pt-0 text-left">{subtitle}</h4>
      </header>
      <div className="flex justify-center baseline">
        {icon}
      </div>
      <p className="text-slate-600 leading-relaxed self-baseline text-left mt-6">{description}</p>
    </div>
  )
}
