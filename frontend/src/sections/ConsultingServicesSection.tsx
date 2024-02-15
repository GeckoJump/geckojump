import React from 'react'
import { ServiceItem } from '../components/ServiceItem'
import { GoGoal } from "react-icons/go";
import { IoIosPeople } from "react-icons/io";

export const ConsultingServicesSection = () => {
  return (
    <div id="consulting-services-section" className="flex flex-col align-baseline snap-center scroll-mt-20">
      <h2 className="text-4xl font-bold pb-2 text-center font-BebasNeue">BUILDING <span className='text-emerald-700'>YOUR FUTURE</span></h2>
      <p className="text-gray-500 text-center mb-10">Prioritizing client relationships allow us to craft a future where your success is not just a goal but a shared venture.</p>
      <ServiceItem 
        title="Blueprint for Success"
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
