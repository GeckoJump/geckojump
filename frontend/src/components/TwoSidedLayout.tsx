import React from 'react'
import { useInView } from 'react-intersection-observer'

export interface TwoSidedLayoutProps {
  children: [React.ReactNode, React.ReactNode],
  additionalClasses?: string,
  fadeInLeftAndRight?: boolean
}

export const TwoSidedLayout = ({ children, additionalClasses }: TwoSidedLayoutProps) => {

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  return (
    <div ref={ref} className={`grid lg:grid-cols-2 md:grid-cols-1 lg:w-3/5 md:4/5 mx-auto gap-10 ${additionalClasses ?? ''}`}>
      <div className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
        {children[0]}
      </div>
      <div className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        {children[1]}
      </div>
    </div>
  )
}
