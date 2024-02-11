import React from 'react'
import { ServiceItem } from '../components/ServiceItem'
import { FaCheckCircle } from 'react-icons/fa'
import { GoGoal } from "react-icons/go";
import { IoIosPeople } from "react-icons/io";

export const SoftwareServicesSection = () => {
  return (
    <div id="software-services-section" className="flex flex-col align-baseline snap-center scroll-mt-20">
      <h2 className="text-4xl font-bold pb-2 text-center font-BebasNeue">Software <span className='text-emerald-700'>For You</span></h2>
      <p className="text-gray-500 text-center mb-10">Empowering your Vision with customized software solutions crafted specifically for your unique needs.</p>
      <ServiceItem 
        title="Let's Talk About Your Goals"
        description="We start with personalized conversations to grasp your unique business goals. This way, our software solutions are perfectly aligned with your vision for success."
        icon={<GoGoal size={20} />} 
      />
      <ServiceItem 
        title="We're in This Together"
        description="We foster ongoing collaboration, evolving our solutions alongside your business needs. Our commitment to regular communication ensures that our software remains a dynamic asset for your sustained success."
        icon={<IoIosPeople size={24} />} 
      />
    </div>
  )
}
