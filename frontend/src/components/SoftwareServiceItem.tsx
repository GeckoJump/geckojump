import React from 'react'

interface SoftwareServiceItemProps {
  title: string
  description: string
  icon: React.ReactNode
}

export const SoftwareServiceItem = ({ title, description, icon }: SoftwareServiceItemProps) => {
  return (
    <div className="flex flex-col align-baseline">
      <h3 className="flex flex-row text-xl font-sans font-bold p-3 pb-2 gap-2 lg:justify-start justify-center">
        <div className="text-2xl my-auto">{icon}</div>
        {title}
      </h3>
      <p className="text-gray-500 w-3/4 lg:text-left lg:mx-0 text-center mx-auto">{description}</p>
    </div>
  )
}