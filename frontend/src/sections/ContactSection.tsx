import React from 'react'
import { FaPaperPlane } from 'react-icons/fa';
import { GoPaperAirplane } from 'react-icons/go';
import { IoIosAirplane, IoMdPaperPlane } from 'react-icons/io';

export const ContactSection = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [message, setMessage] = React.useState('');

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ name, email, phone, company, message });

    if (!name || !email || !phone || !company || !message) {
      alert('Please fill out all fields');
      return;
    }

    setIsSubmitting(true);

    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phone, company, message }),
    }).then((res) => {
      if (res.ok) {
        alert('Thank you for your message. We will be in touch soon.');
        setName('');
        setEmail('');
        setPhone('');
        setCompany('');
        setMessage('');
      } else {
        alert('Something went wrong. Please try again.');
      }
      setIsSubmitting(false);
    });
  }


  return (
    <div id="contact-section" className="flex flex-col items-center w-full justify-center py-12 bg-zinc-50 snap-center scroll-mt-20">
      <h2 className="text-4xl font-bold pb-2 text-center font-BebasNeue">Let's Get <span className="text-emerald-700">To Work</span></h2>
      <p className="text-gray-500 px-4 md:px-0 text-center mb-10">We would love to work with you. Leave us your contact information and we will be in touch as soon as possible. </p>
      <form onSubmit={handleSubmit} className="flex flex-col w-3/4 lg:w-1/2 gap-4 justify-center">
        <input onChange={(e) => setName(e.target.value)} value={name} className="p-3 rounded-lg outline-2 hover:outline focus:outline outline-emerald-700/50 transition-colors duration-300 shadow-md" type="text" placeholder="Your Name" />
        <input onChange={(e) => setEmail(e.target.value)} value={email} className="p-3 rounded-lg outline-2 hover:outline focus:outline outline-emerald-700/50 transition-colors duration-300 shadow-md" type="email" placeholder="Your Email" />
        <div className="flex flex-col md:flex-row w-full gap-4">
          <input onChange={(e) => setPhone(e.target.value)} value={phone} className="p-3 flex-1 rounded-lg outline-2 hover:outline focus:outline outline-emerald-700/50 transition-colors duration-300 shadow-md" type="text" placeholder="Your Phone" />
          <input onChange={(e) => setCompany(e.target.value)} value={company} className="p-3 flex-1 rounded-lg outline-2 hover:outline focus:outline outline-emerald-700/50 transition-colors duration-300 shadow-md" type="text" placeholder="Your Company Name" />
        </div>
        <textarea onChange={(e) => setMessage(e.target.value)} value={message} className="p-3 h-36 rounded-lg outline-2 hover:outline focus:outline outline-emerald-700/50 transition-colors duration-300 shadow-md" placeholder="Additional information"></textarea>
        <button className="p-2 bg-emerald-700 font-semibold hover:bg-emerald-500 w-1/5 self-start text-white rounded-lg shadow-2xl hover:shadow-slate-400 transition-all duration-150">{isSubmitting ? "Sending..." : (<div className='flex flex-row justify-center gap-1 items-baseline'>Send<IoMdPaperPlane className='relative top-0.5' size={16}  /></div>)}</button>
      </form>
    </div>
  )
}
