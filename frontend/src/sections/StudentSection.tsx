import React from 'react'
import im from '../svg/undraw_ideation.svg'
import { AspectRatio } from '../components/AspectRatio'
import { useInView } from 'react-intersection-observer'

const OUT_OF_VIEW_CLASSES = 'opacity-0 translate-y-10';
const IN_VIEW_CLASSES = 'opacity-100 translate-y-0';

const StudentSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  return (
    <section ref={ref} className="w-full bg-neutral-800">
      <div className={`w-3/4 grid grid-cols-12 gap-x-12 grid-rows-1 justify-center py-24 px-4 mx-auto transition-all duration-1000 ${inView ? IN_VIEW_CLASSES : OUT_OF_VIEW_CLASSES}`}>
        <div className="col-span-8">
          <h2 className="text-4xl text-zinc-100 font-BebasNeue leading-snug tracking-wide mb-6">Crafted by Future Innovators</h2>
          <div className='text-zinc-300'>
            <p className="text-lg mb-12 pr-4 leading-relaxed indent-4">GeckoJump™ is not just a company; it’s a movement. Founded by visionary students committed to making a tangible impact in the tech industry, we continue to grow with a team fueled by the brightest minds from academia. Our journey is a testament to what student innovation, driven by fresh ideas and boundless energy, can achieve.</p>
            <p className="text-lg pr-4 leading-relaxed indent-4">Our founders, still navigating their academic paths, envisioned a new kind of tech company—one where the energy, creativity, and cutting-edge knowledge of students transform how businesses interact with technology. GeckoJump™ stands as a beacon of student entrepreneurship, demonstrating the remarkable outcomes when youthful innovation meets industry experience.</p>
          </div>
        </div>
        <div className="col-span-4 grid grid-rows-1 grid-cols-1 items-center">
            <AspectRatio className="flex items-center rounded-sm overflow-hidden bg-zinc-50 p-6">
              <img src={im} alt="Students" />
            </AspectRatio>
        </div>
      </div>

    </section>
  )
}

export default StudentSection