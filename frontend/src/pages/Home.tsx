import React from 'react';
import '../css/Home.css';
import  StickyNavbar  from '../components/StickyNavbar';
import { HeroSection } from '../sections/HeroSection';
import { ServicesSection } from '../sections/ValuesSection';
import { Footer } from '../components/Footer';
import { TwoSidedLayout } from '../components/TwoSidedLayout';
import { SoftwareServicesSection } from '../sections/SoftwareServicesSection';
import TechIllustration1 from '../svg/tech-illustration-1.svg'
import TechIllustration2 from '../svg/tech-illustration-2.svg'
import { SectionDivider } from '../components/SectionDivider';
import { ConsultingServicesSection } from '../sections/ConsultingServicesSection';
import { ContactSection } from '../sections/ContactSection';

function App() {
  return (
    <>
      <StickyNavbar />
      <HeroSection />
      <ServicesSection />
      <SectionDivider className='pt-24 lg:pt-48' />
      <TwoSidedLayout>
        <SoftwareServicesSection />
        <img src={TechIllustration1} className="scale-75 lg:scale-100" alt='Tech Illustration 1' />
      </TwoSidedLayout>
      <SectionDivider className='pt-24 lg:pt-48' />
      <TwoSidedLayout additionalClasses='[&>*:first-child]:order-last md:[&>*:first-child]:order-first'>
        <img src={TechIllustration2} className="scale-75 lg:scale-100" alt='Tech Illustration 1' />
        <ConsultingServicesSection />
      </TwoSidedLayout>
      <SectionDivider className='pt-12 lg:pt-24' />
      <ContactSection />
      <Footer />
    </>
  );
}

export default App;
