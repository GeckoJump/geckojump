import React from 'react'

interface SectionDividerProps {
  // Size should be one of the following: 'small', 'medium', 'large'
  className?: string
}

export const SectionDivider = ({ className: classes }: SectionDividerProps) => {

  return (
    <div className={`${classes} w-full`}></div>
  )
}
