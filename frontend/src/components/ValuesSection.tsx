import React from 'react'
import { FaRegHandshake } from "react-icons/fa";
import { ValueItem } from './ValueItem'
import { useInView } from 'react-intersection-observer';

export const ServicesSection = () => {

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  return (
    <div ref={ref}>
      <div className={`flex flex-col justify-center align-middle duration-1000 ${inView ? 'transition-all opacity-100 translate-y-0' : 'transition-none opacity-0 translate-y-8'}`}>
        <div className='values-header text-center pb-8 px-2'>
          <h2 className='text-4xl font-bold font-BebasNeue'>WHY <span className='text-emerald-700'>CHOOSE US</span></h2>
          <p className='text-gray-500 mt-1 lg:w-2/5 md:w-4/5 mx-auto'>
            Our commitment to <span className="font-bold">you</span> extends beyond delivering premium software solutions. We are dedicated to building long-lasting, quality relationships with our clients.
          </p>
        </div>
        <div className='values grid md:grid-cols-2 sm:grid-cols-1 max-w-screen-sm mx-auto gap-6'>
          <ValueItem
            title='Quality Relationships'
            description='Our team is dedicated to building long-lasting, quality relationships with our clients.'
            icon={<FaRegHandshake className='text-5xl' />}
          />
          <ValueItem
            title='Tailored Service'
            description='We learn what makes your business unique in order to provide tailored solutions that will help you succeed.'
            icon={<FaRegHandshake className='text-5xl' />}
          />
          <ValueItem
            title='Expertise'
            description='Our team has the expertise to provide the best solutions for your business.'
            icon={<FaRegHandshake className='text-5xl' />}
          />
          <ValueItem
            title='Innovation'
            description='We are always looking for innovative ways to help your business succeed.'
            icon={<FaRegHandshake className='text-5xl' />}
          />


        </div>
      </div>
    </div>
  )
}
