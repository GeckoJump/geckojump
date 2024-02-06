import React, { useState } from 'react'
import { TypeAnimation } from 'react-type-animation'

export const HeroSection = () => {

  const [typedOut, setTypedOut] = useState(false)

  const svgStyle = {
    display: 'block',
    width: 'calc(242% + 1.3px)',
    height: '145px'
  }

  const pathStyle = {
    fill: '#111827',
  }

  return (
    <div className="flex flex-col">
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-3xl w-full text-center">
            <h1
              className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
            >
              <TypeAnimation
                wrapper="span"
                style={{ display: "block", whiteSpace: "pre-line" }}
                sequence={[
                  "Elevate Your Business\n With Tech.",
                  1000,
                  "Elevate Your Business\n With Tech Tailored For You.",
                  () => setTypedOut(true)
                ]}
                preRenderFirstString={true}
                speed={50}
                />
            </h1>

            <p className={`mx-auto mt-4 max-w-lg sm:text-xl/relaxed transition-all duration-1000 ${typedOut ? 'opacity-100' : 'opacity-0'} ${typedOut ? '' : 'translate-y-4'}`}>
              We specialize in crafting tailored software solutions for your business needs.
            </p>

            <div className={`mt-8 flex flex-wrap justify-center gap-4 transition-opacity delay-1000 duration-1000 opacity-${typedOut ? '100' : '0'}`}>
              <a
                className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                href="/get-started"
              >
                Get Started
              </a>

              <a
                className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                href="/about"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
      <div>
        <div className="w-full overflow-hidden">
          <svg style={svgStyle} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" style={pathStyle}></path>
          </svg>
        </div>
      </div>
    </div>

  )
}
