import React from 'react'
import { ValueItem } from '../components/ValueItem'
import { useInView } from 'react-intersection-observer';
import { RiComputerLine, RiCustomerServiceLine, RiLightbulbFlashLine } from "react-icons/ri";
import ValuesSVG1 from '../svg/values1.svg'
import InnovationIcon from '../svg/undraw_predictive_analytics_re_wxt8.svg'
import SoftwareExpertiseIcon from '../svg/undraw_dev_productivity_re_fylf.svg'
import TailoredServiceIcon from '../svg/undraw_business_chat_re_gg4h.svg'
import QualityRelationshipsIcon from '../svg/undraw_sharing_knowledge_03vp.svg'
import IconImage from '../components/IconImage';


const ICON_SIZE = 64
const ICON_CLASSES = ''

export const ServicesSection = () => {

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  return (
    <div id="values-section" ref={ref} className='snap-center scroll-mt-20'>
      <div className={`flex flex-col justify-center align-middle duration-1000 ${inView ? 'transition-all opacity-100 translate-y-0' : 'transition-none opacity-0 translate-y-8'}`}>
        <div className='text-center px-2 mb-2'>
          <h2 className='text-4xl font-bold font-BebasNeue'>WHY <span className='text-emerald-700'>CHOOSE US</span></h2>
          <p className='text-gray-500 mb-4 mt-1 lg:w-2/5 md:w-4/5 mx-auto'>
            Our commitment to <span className="font-bold">you</span> extends beyond delivering premium software solutions. We are dedicated to building long-lasting, quality relationships with our clients.
          </p>
        </div>
        <div className='grid md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-4 xl:grid-rows-1 xl:max-w-screen-xl w-3/4 xl:w-11/12 max-w-screen-sm grid-rows-[1fr,1fr] items-stretch mx-auto gap-6 lg:mt-8'>
          <ValueItem
            title='Quality Relationships'
            subtitle='Commitment to You'
            description='Our team is dedicated to building long-lasting, quality relationships with our clients.'
            icon={<IconImage src={QualityRelationshipsIcon} alt='Quality Relationships' className='max-w-[128px]' />}
          />
          <ValueItem
            title='Tailored Service'
            subtitle='Unique Solutions for You'
            description='We learn what makes your business unique in order to provide tailored solutions that will help you succeed.'
            icon={<IconImage src={TailoredServiceIcon} alt='Tailored Service' className='w-3/5' />}
          />
          <ValueItem
            title='Software Expertise'
            subtitle='Best Solutions for You'
            description='Our team has the expertise to provide the best solutions for your business.'
            icon={<IconImage src={SoftwareExpertiseIcon} alt='Software Expertise' className='w-3/5' />}
          />
          <ValueItem
            title='Constant Innovation'
            subtitle='Always Looking Forward'
            description='We are always looking for innovative ways to help your business succeed.'
            icon={<IconImage src={InnovationIcon} alt='Constant Innovation' className='w-3/5' />}
            btnFace='Learn More'
          />


        </div>
      </div>
    </div>
  )
}
