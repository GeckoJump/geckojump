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
  btnFace?: string
  onFocus?: (index: number) => void
}

export const ValueItem = ({ index, title, description, icon, subtitle, btnFace, onFocus }: ValueItemProps) => {
  const [isActive, setIsActive] = useState(false)

  if (onFocus && index === undefined) {
    console.error('ValueItem: onFocus prop is defined but index is not')
  }

  return (
    <div id={`value-item-${index}`} className={`grid col-span-1 grid-rows-subgrid ${btnFace ? 'row-span-5' : 'row-span-4'} p-6 pb-0 bg-white shadow-xl shadow-slate-300 hover:shadow-slate-400 transition-all duration-100 rounded-lg rounded-b-3xl pb-2`}>
      <header>
        <h3 className="text-xl font-semibold tracking-wide pb-0 text-left">{title}</h3>
        <h4 className="text-md font-normal text-slate-500 pb-2 pt-0 text-left">{subtitle}</h4>
      </header>
      <div className="flex justify-center baseline">
        {icon}
      </div>
      <p className="text-slate-600 self-baseline text-left mt-6">{description}</p>
      {btnFace &&
        <button onClick={
          () => {
            setIsActive(isActive => !isActive)
            onFocus && onFocus(index)
          }
        } 
        className="flex text-nowrap outline-sky-700 outline-2 outline font-semibold text-sky-700 rounded-full p-3 py-0.5 mx-auto mt-3 transition-all duration-150 hover:bg-sky-600 hover:outline-sky-600 hover:text-zinc-50">
          <p className='flex-1 tracking-tight'>
            {btnFace}
          </p>
          <IoMdArrowDropright size={18} className='my-[5px]' />
        </button>
      }
    </div>
  )
}
