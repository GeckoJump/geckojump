import React from 'react'

interface ValueItemProps {
  title: string
  description: string
  icon: React.ReactNode
}

export const ValueItem = ({ title, description, icon }: ValueItemProps) => {
  return (
    <div className="flex flex-col col-span-1 mx-3 h-70 outline-1 outline outline-emerald-700/40 bg-zinc-50 align-baseline p-6 pt-10 pb-8 shadow-2xl shadow-slate-300 hover:shadow-slate-400 transition-shadow rounded-2xl">
      <div className="mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-sans font-bold pb-2 text-center">{title}</h3>
      <p className="text-gray-500 text-center">{description}</p>
    </div>
  )
}
