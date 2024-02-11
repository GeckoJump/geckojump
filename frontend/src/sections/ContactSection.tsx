import React from 'react'

export const ContactSection = () => {
  return (
    <div id="contact-section" className="flex flex-col items-center w-full justify-center py-12 bg-zinc-50 snap-center scroll-mt-20">
      <h2 className="text-4xl font-bold pb-2 text-center font-BebasNeue">Let's Get <span className="text-emerald-700">To Work</span></h2>
      <p className="text-gray-500 px-4 md:px-0 text-center mb-10">We would love to work with you. Leave us your contact information and we will be in touch as soon as possible. </p>
      <form className="flex flex-col w-3/4 lg:w-1/2 gap-4 justify-center">
        <input className="p-3 rounded-lg outline-2 hover:outline focus:outline outline-emerald-700/50 transition-colors duration-300 shadow-md" type="text" placeholder="Your Name" />
        <input className="p-3 rounded-lg outline-2 hover:outline focus:outline outline-emerald-700/50 transition-colors duration-300 shadow-md" type="email" placeholder="Your Email" />
        <div className="flex flex-col md:flex-row w-full gap-4">
          <input className="p-3 flex-1 rounded-lg outline-2 hover:outline focus:outline outline-emerald-700/50 transition-colors duration-300 shadow-md" type="text" placeholder="Your Phone" />
          <input className="p-3 flex-1 rounded-lg outline-2 hover:outline focus:outline outline-emerald-700/50 transition-colors duration-300 shadow-md" type="text" placeholder="Your Company Name" />
        </div>
        <textarea className="p-3 h-36 rounded-lg outline-2 hover:outline focus:outline outline-emerald-700/50 transition-colors duration-300 shadow-md" placeholder="Additional information"></textarea>
        <button className="p-3 bg-emerald-700 hover:bg-emerald-500 w-1/4 self-start text-white rounded-lg shadow-2xl hover:shadow-slate-400 transition-all duration-150">Send</button>
      </form>
    </div>
  )
}
