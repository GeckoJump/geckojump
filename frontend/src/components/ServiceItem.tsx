import React from 'react'

interface SoftwareServiceItemProps {
  title: string
  description: string
  icon: React.ReactNode
}

export const ServiceItem = ({ title, description, icon }: SoftwareServiceItemProps) => {
  return (
    <div className="flex flex-col align-baseline">
      <h3 className="flex flex-row text-xl leading-snug font-sans font-bold p-3 pl-0 gap-2 lg:justify-start justify-center">
        {title}
      </h3>
      <p className="text-gray-500 w-full lg:text-left lg:mx-0 leading-relaxed text-center mx-auto">{description}</p>
    </div>
  )
}