import React from 'react';
import './App.css';
import { StickyNavbar } from './components/StickyNavbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ValuesSection';
import { Footer } from './components/Footer';
import { TwoSidedLayout } from './components/TwoSidedLayout';
import { SoftwareServices } from './components/SoftwareServices';
import TechIllustration1 from './svg/tech-illustration-1.svg'

function App() {
  return (
    <>
      <StickyNavbar />
      <HeroSection />
      <ServicesSection />
      <TwoSidedLayout additionalClasses='pt-24 lg:pt-48'>
        <SoftwareServices />
        <img src={TechIllustration1} className="scale-75 lg:scale-100" alt='Tech Illustration 1' />
      </TwoSidedLayout>
      <Footer />
    </>
  );
}

export default App;
