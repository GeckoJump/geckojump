import React from 'react'
import { SoftwareServiceItem } from './SoftwareServiceItem'
import { FaCheckCircle } from 'react-icons/fa'

export const SoftwareServices = () => {
  return (
    <div className="flex flex-col align-baseline">
      <h2 className="text-3xl font-sans font-bold pb-2 text-center">Software Services</h2>
      <p className="text-gray-500 text-center mb-10">We offer a variety of software services to help you get started with your project.</p>
      <SoftwareServiceItem 
        title="Web Development"
        description="We can help you build a website that will help you succeed. Our team has the expertise to provide the best solutions for your business."
        icon={<FaCheckCircle size={16} />} 
      />
      <SoftwareServiceItem 
        title="Web Development"
        description="We can help you build a website that will help you succeed. Our team has the expertise to provide the best solutions for your business."
        icon={<FaCheckCircle size={16} />} 
      />
    </div>
  )
}
