import React from 'react'

interface ValueItemProps {
  title: string
  description: string
  icon: React.ReactNode
}

export const ValueItem = ({ title, description, icon }: ValueItemProps) => {
  return (
    <div className="flex flex-col align-baseline">
      <div className="mx-auto mb-3">
        {icon}
      </div>
      <h3 className="text-xl font-sans font-bold pb-2 text-center">{title}</h3>
      <p className="text-gray-500 text-center">{description}</p>
    </div>
  )
}
