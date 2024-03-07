import React from 'react'
import { useInView } from 'react-intersection-observer'

export interface TwoSidedLayoutProps {
  children: [React.ReactNode, React.ReactNode],
  additionalClasses?: string,
  flip?: boolean
}

export const TwoSidedLayout = ({ children, additionalClasses, flip }: TwoSidedLayoutProps) => {

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <div ref={ref} className={`w-full flex justify-center items-center py-36 ${additionalClasses ?? ''}`}>
      <div className={'grid items-center md:grid-cols-2 grid-cols-1 lg:w-3/5 md:w-4/5 w-[90%] mx-auto gap-10 ' + (flip ? '[&>*:first-child]:order-last md:[&>*:first-child]:order-first' : '')}>
        <div className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          {children[0]}
        </div>
        <div className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          {children[1]}
        </div>
      </div>
    </div>
  )
}
