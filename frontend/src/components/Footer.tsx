import React from 'react'

const LINKS = [
  {
    title: "Product",
    items: ["Overview", "Features", "Solutions", "Tutorials"],
  },
  {
    title: "Company",
    items: ["About us", "Careers", "Press", "News"],
  },
  {
    title: "Resource",
    items: ["Blog", "Newsletter", "Events", "Help center"],
  },
];

export const Footer = () => {
  return (
    <div className="flex justify-center w-full bg-background py-10">
      <div className="container flex flex-col w-3/5">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {LINKS.map((link, i) => (
            <div key={i}>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{link.title}</h3>
              <ul className="mt-4 space-y-2">
                {link.items.map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-row justify-evenly w-3/4">
          <div className="max-w-screen-xl w-full p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">GeckoJump™</a>. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">About</a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  )
}
