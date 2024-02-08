import React, { useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { useInView } from 'react-intersection-observer'

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
      <section className="flex flex-col justify-center bg-background text-white h-screen">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="flex flex-col justify-center mx-auto max-w-3xl w-full text-center">
            <h1
              className="bg-gradient-to-r from-green-700 via-green-400 to-blue-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
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
            <p className={`mx-auto mt-4 max-w-md sm:text-xl/relaxed transition-all duration-1000 text-slate-200 ${typedOut ? 'opacity-100' : 'opacity-0'} ${typedOut ? '' : 'translate-y-4'}`}>
              We specialize in crafting custom software solutions by understanding your business needs.
            </p>
          </div>
        </div>
      </section>
      <div>
        <div className="w-full overflow-hidden">
          <svg style={svgStyle} className='' data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" style={pathStyle}></path>
          </svg>
        </div>
      </div>
    </div>

  )
}
