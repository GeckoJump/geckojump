import React from 'react';
import './App.css';
import { StickyNavbar } from './components/StickyNavbar';
import { HeroSection } from './sections/HeroSection';
import { ServicesSection } from './sections/ValuesSection';
import { Footer } from './components/Footer';
import { TwoSidedLayout } from './components/TwoSidedLayout';
import { SoftwareServicesSection } from './sections/SoftwareServicesSection';
import TechIllustration1 from './svg/tech-illustration-1.svg'
import { SectionDivider } from './components/SectionDivider';

function App() {
  return (
    <>
      <StickyNavbar />
      <HeroSection />
      <ServicesSection />
      <SectionDivider className='pt-12 lg:pt-48' />
      <TwoSidedLayout>
        <SoftwareServicesSection />
        <img src={TechIllustration1} className="scale-75 lg:scale-100" alt='Tech Illustration 1' />
      </TwoSidedLayout>
      <Footer />
    </>
  );
}

export default App;
