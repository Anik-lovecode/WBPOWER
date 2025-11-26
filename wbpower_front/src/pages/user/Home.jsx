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
import NavBar1 from '../../components/user/NavBar1.jsx';  
import '../../index.css';
import Navbar from '../../components/user/Navbar.jsx';
import NavNew from '../../components/user/NavNew.jsx';


const Home = () => {
  return (
    <div>

    <TopBar />
    <LogoSection className="LogoSection" />
    {/* <NavBar1/> */}
     {/* <Navbar  /> */}
     <NavNew />
    <HeroBanner /> 
    <NewsBar/> 
    <AboutSection />
    {/* <NavBar1/> */}
    
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