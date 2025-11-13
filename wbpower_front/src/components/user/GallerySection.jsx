
import React, { useState, useEffect } from "react";

const GallerySection = () => {
  const images = [1, 2, 3, 4].map((i) => `/images/gallery-${i}.png`);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="container gallery-section">
  <div className="row align-items-start">
    {/* Left: Gallery */}
    <div className="col-lg-7 mb-4 mb-lg-0">
      <h5 className="fw-bold mb-3">Photo Gallery</h5>
      {/* Main Image */}
      <img
        id="mainImage"
        src="./images/gallery-1.png"
        className="main-img mb-3"
        alt="Main Gallery"
      />
      {/* Thumbnail Row */}
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <img
            src="./images/gallery-1.png"
            className="thumb img-fluid rounded-4 active"
            alt="thumb 1"
          />
        </div>
        <div className="col-6 col-md-3">
          <img
            src="./images/gallery-2.png"
            className="thumb img-fluid rounded-4"
            alt="thumb 2"
          />
        </div>
        <div className="col-6 col-md-3">
          <img
            src="./images/gallery-3.png"
            className="thumb img-fluid rounded-4"
            alt="thumb 3"
          />
        </div>
        <div className="col-6 col-md-3">
          <img
            src="./images/gallery-4.png"
            className="thumb img-fluid rounded-4"
            alt="thumb 4"
          />
        </div>
      </div>
    </div>
    {/* Right: Important Links */}
    <div className="col-lg-5 important-links">
      <h5 className="fw-bold mb-3 ms-4 ">Important Links</h5>
      <ul className="mb-0 link-text ms-5">
        <li>
          <a href="#">Grievance</a>
        </li>
        <li>
          <a href="#">License Renewal</a>
        </li>
        <li>
          <a href="#">EODB</a>
        </li>
        <li>
          <a href="#">
            Lift, Escalator, Electrical Licensing Board and other online
            services of DOE.
          </a>
        </li>
        <li>
          <a href="#">Feedback</a>
        </li>
      </ul>
    </div>
  </div>
</div>

  );
};
export default GallerySection;
