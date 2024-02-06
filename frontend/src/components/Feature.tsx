import React from 'react'

interface FeatureProps {
  title: string
  description: string
  icon: React.ReactNode
}

export const Feature = ({ title, description, icon }: FeatureProps) => {
  return (
    <div className="grid grid-cols-[1fr_3fr] gap-4">
      <div className="flex items-center justify-center align-middle">
        {icon}
      </div>
      <div>
        <h3 className="text-balance text-lg font-bold pb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  )
}
