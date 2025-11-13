import React from "react";

const Footer = () => (
  <footer className="footer py-3">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-5 col-md-12 mb-3 mb-lg-0">
          <p className="mb-1 footer-text">Content Owned by District Administration</p>
          <p className="mb-1 footer-text">
            Developed and hosted by{" "}
            <a href="#" className="footer-link">National Informatics Centre</a>,
          </p>
          <p className="mb-1 footer-text">
            <a href="#" className="footer-link">
              Ministry of Electronics & Information Technology
            </a>, Government of India
          </p>
        </div>
        <div className="col-lg-4 col-md-12 text-lg-center text-md-start mb-3 mb-lg-0">
          <a href="#" className="footer-nav-link">Website Policies</a> |{" "}
          <a href="#" className="footer-nav-link">Help</a> |{" "}
          <a href="#" className="footer-nav-link">Contact Us</a> |{" "}
          <a href="#" className="footer-nav-link">Feedback</a>
        </div>
        <div className="col-lg-3 col-md-12 text-lg-end text-md-start text-center">
          <p className="mb-0 footer-text-small">design & develop by</p>
          <img src="/images/nic-logo.png" alt="NIC Logo" className="footer-logo mb-1" />
          <p className="footer-text-small mb-0">Last Updated: Nov 28, 2025</p>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;
