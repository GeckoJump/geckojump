import React from 'react'

export interface TwoSidedLayoutProps {
  children: [React.ReactNode, React.ReactNode],
  additionalClasses?: string
}

export const TwoSidedLayout = ({ children, additionalClasses }: TwoSidedLayoutProps) => {
  return (
    <div className={`grid grid-cols-2 w-3/5 mx-auto gap-10 ${additionalClasses ?? ''}`}>
      <div>
        {children[0]}
      </div>
      <div>
        {children[1]}
      </div>
    </div>
  )
}
