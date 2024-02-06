import React from 'react'
import { FiAirplay } from "react-icons/fi";
import { Feature } from './Feature'

export const ServicesSection = () => {
  return (
    <div className='flex flex-col justify-center align-middle'>
      <div className='services-header text-center pb-8 px-2'>
        <h4 className='font-semibold text-blue-500'>Why choose us</h4>
        <h2 className='text-3xl font-bold'>Our Core Features</h2>
        <p className='text-gray-500 mt-4'>
          We provide cutting edge software solutions tailored to your business needs.
        </p>
      </div>
      <div className='services grid md:grid-cols-2 sm:grid-cols-1 max-w-screen-md mx-auto gap-4'>
        {Array.from(Array(4).keys()).map((i) => (
          <Feature
            title='Feature'
            description='Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            icon={<FiAirplay size={48} />}
            key={i}
          />
        ))}
      </div>
    </div>
  )
}
