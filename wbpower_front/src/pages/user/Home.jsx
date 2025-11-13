import React from 'react'
import TopBar from "../../components/user/TopBar";
import LogoSection from "../../components/user/LogoSection";
import HeroBanner from "../../components/user/HeroBanner";
import AboutSection from "../../components/user/AboutSection";
import NewsSection from "../../components/user/NewsSection";
import FAQSection from "../../components/user/FAQSection";
import PowerSection from "../../components/user/PowerSection";
import MapSection from "../../components/user/MapSection";
import GallerySection from "../../components/user/GallerySection";
import Footer from "../../components/user/Footer";
import NewsBar from '../../components/user/NewsBar';
import Info from '../../components/user/Info';
import '../../index.css';


const Home = () => {
  return (
    <div>

    <TopBar />
    <LogoSection />
    <HeroBanner /> 
    <NewsBar/> 
    <AboutSection />
    <NewsSection />
    <Info/>
    <GallerySection />
    <FAQSection />
    {/*<PowerSection />    */}
    
    <MapSection />
    
    <Footer />
    
    </div>
  )
}

export default Home