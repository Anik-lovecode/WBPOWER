import React from 'react'
import Navbar from '../../components/user/Navbar.jsx';
import Footer from "../../components/user/Footer";
import ContactTable from '../../components/user/contact_us/ContactTable.jsx';  
import OfficeInfo from '../../components/user/contact_us/OfficeInfo.jsx';
import MapSection from '../../components/user/contact_us/MapSection.jsx';

const ContactUs = () => {
  return (
    <div>
      <Navbar  />
      <ContactTable />
      <OfficeInfo/>
      <MapSection/>
      <Footer />
    </div>
  )
}

export default ContactUs