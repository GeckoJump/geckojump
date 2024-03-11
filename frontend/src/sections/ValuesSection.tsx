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

  const onItemFocus = async (index: number) => {
    const indiciesToPop = [0, 1, 2, 3].filter(i => i !== index)
      indiciesToPop.map((key, idx) => {
        const el = document.getElementById(`value-item-${key}`)
        setTimeout(() => {
          el?.classList.add('-translate-y-1/3', 'scale-0')
        }, idx * 100)
        setTimeout(() => {}, 100)
      })

      const el = document.getElementById(`value-item-${index}`)
      setTimeout(() => {
        el?.classList.add('col-start-1', 'col-span-4', 'row-start-1', 'row-span-1')
      }, 400)

    }

    return (
    <div id="values-section" ref={ref} className='snap-center scroll-mt-20'>
      <div className={`flex flex-col justify-center align-middle duration-1000 ${inView ? 'transition-all opacity-100 translate-y-0' : 'transition-none opacity-0 translate-y-8'}`}>
        <div className='text-center px-2 mb-2'>
          <h2 className='text-4xl font-bold font-BebasNeue'>YOUR PARTNER <span className='text-emerald-700'>IN SUCCESS</span></h2>
          <p className='text-gray-500 mb-4 mt-1 lg:w-2/5 md:w-4/5 mx-auto'>
            We're here to change the narrative by proving that a tech partner can indeed put client relationships at the forefront.
          </p>
        </div>
        <div className='grid md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-3 xl:grid-rows-1 xl:max-w-screen-xl w-2/3 max-w-screen-sm grid-rows-[1fr,1fr] items-stretch mx-auto gap-6 lg:mt-8'>
          <ValueItem
            index={0}
            title='Unmatched Relationships'
            subtitle='Building Better Together'
            description={'We believe the foundation of any successful project is a genuine relationship. That\'s why we dedicate ourselves to being not just a service provider but a trusted partner.'}
            icon={<IconImage src={QualityRelationshipsIcon} alt='Quality Relationships' size={172} />}
            onFocus={onItemFocus}
          />
          <ValueItem
            index={1}
            title='Tailored Service'
            subtitle='Unique Solutions for You'
            description='Your business is unique, and so should be your software. We dive deep into what sets your company apart to deliver personalized solutions that truly make a difference.'
            icon={<IconImage src={TailoredServiceIcon} alt='Tailored Service' size={172} />}
            onFocus={onItemFocus}
          />
          <ValueItem
            index={2}
            title='Expertise Meets Care'
            subtitle='Expert Guidance, Personal Touch'
            description='Combining top-notch expertise with a genuine commitment to your success, we ensure you have the dedicated support needed to thrive.'
            icon={<IconImage src={SoftwareExpertiseIcon} alt='Software Expertise' size={172} />}
            onFocus={onItemFocus}
          />
        </div>
      </div>
    </div>
  )
}
