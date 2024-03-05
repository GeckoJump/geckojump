import React from 'react'

interface SoftwareServiceItemProps {
  title: string
  description: string
  icon: React.ReactNode
}

export const ServiceItem = ({ title, description }: SoftwareServiceItemProps) => {
  return (
    <div className="flex flex-col align-baseline">
      <h3 className="flex flex-row text-xl leading-snug font-semibold p-3 pl-0 lg:mx-0 mx-3 gap-2 lg:justify-start justify-center">
        {title}
      </h3>
      <p className="text-gray-500 w-full lg:text-left lg:mx-0 leading-relaxed text-center mx-3">{description}</p>
    </div>
  )
}