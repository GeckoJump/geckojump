import React from 'react';
import './App.css';
import { StickyNavbar } from './components/StickyNavbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ValuesSection';
import { Footer } from './components/Footer';

function App() {
  return (
    <>
      <StickyNavbar />
      <HeroSection />
      <ServicesSection />
      <Footer />
    </>
  );
}

export default App;
