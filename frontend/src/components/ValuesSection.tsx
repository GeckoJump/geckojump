import React from 'react'
import { FaRegHandshake } from "react-icons/fa";
import { Feature } from './Feature'

export const ServicesSection = () => {
  return (
    <div className='flex flex-col justify-center align-middle'>
      <div className='values-header text-center pb-8 px-2'>
        <h2 className='text-4xl font-bold font-BebasNeue'>WHY <span className='text-emerald-700'>CHOOSE US</span></h2>
        <p className='text-gray-500 mt-1 w-1/3 mx-auto'>
          We are <span className="font-bold italic">not</span> just another software company. We're a team of experts dedicated to helping your business <span className="font-bold">succeed</span>.
        </p>
      </div>
      <div className='values grid md:grid-cols-2 sm:grid-cols-1 max-w-screen-sm mx-auto gap-6'>
        <Feature
          title='Quality Relationships'
          description='Our team is dedicated to building long-lasting, quality relationships with our clients.'
          icon={<FaRegHandshake className='text-5xl' />}
        />
        <Feature
          title='Tailored Service'
          description='We learn what makes your business unique in order to provide tailored solutions that will help you succeed.'
          icon={<FaRegHandshake className='text-5xl' />}
        />
        <Feature
          title='Expertise'
          description='Our team has the expertise to provide the best solutions for your business.'
          icon={<FaRegHandshake className='text-5xl' />}
        />
        <Feature
          title='Innovation'
          description='We are always looking for innovative ways to help your business succeed.'
          icon={<FaRegHandshake className='text-5xl' />}
        />


      </div>
    </div>
  )
}
