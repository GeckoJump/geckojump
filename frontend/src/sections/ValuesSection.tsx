import React from 'react'
import { FaRegHandshake } from "react-icons/fa";
import { ValueItem } from '../components/ValueItem'
import { useInView } from 'react-intersection-observer';
import { GoGoal } from 'react-icons/go';
import { IoIosPeople, IoIosConstruct } from 'react-icons/io';
import { RiLightbulbFlashFill } from "react-icons/ri";


export const ServicesSection = () => {

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  return (
    <div ref={ref} className='snap-center scroll-mt-10'>
      <div className={`flex flex-col justify-center align-middle duration-1000 ${inView ? 'transition-all opacity-100 translate-y-0' : 'transition-none opacity-0 translate-y-8'}`}>
        <div className='text-center px-2 mb-2'>
          <h2 className='text-4xl font-bold font-BebasNeue'>WHY <span className='text-emerald-700'>CHOOSE US</span></h2>
          <p className='text-gray-500 mb-4 mt-1 lg:w-2/5 md:w-4/5 mx-auto'>
            Our commitment to <span className="font-bold">you</span> extends beyond delivering premium software solutions. We are dedicated to building long-lasting, quality relationships with our clients.
          </p>
        </div>
        <div className='grid md:grid-cols-2 sm:grid-cols-1 grid-rows-[1fr,1fr] items-stretch max-w-screen-sm mx-auto gap-4 gap-x-12'>
          <ValueItem
            title='Quality Relationships'
            description='Our team is dedicated to building long-lasting, quality relationships with our clients.'
            icon={<IoIosPeople className='text-4xl' />}
          />
          <ValueItem
            title='Tailored Service'
            description='We learn what makes your business unique in order to provide tailored solutions that will help you succeed.'
            icon={<GoGoal className='text-4xl' />}
          />
          <ValueItem
            title='Expertise'
            description='Our team has the expertise to provide the best solutions for your business.'
            icon={<IoIosConstruct className='text-4xl' />}
          />
          <ValueItem
            title='Innovation'
            description='We are always looking for innovative ways to help your business succeed.'
            icon={<RiLightbulbFlashFill className='text-4xl' />}
          />


        </div>
      </div>
    </div>
  )
}
