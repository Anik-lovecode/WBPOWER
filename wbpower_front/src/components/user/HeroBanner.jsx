import React from 'react';
import Navbar from './Navbar'
const HeroBanner = () => {
  return <><section className="hero-banner text-white position-relative">
  {/* ✅ Navbar Section */}
  {/* <Navbar /> */}
  {/* ✅ Slider Section */}
  <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
    <div className="carousel-inner">
      {/* ✅ Slide 1 */}
      <div className="carousel-item active">
        <img
          src="./images/banner1.png"
          className="d-block w-100"
          alt="Banner 1"
        />
        <div className="carousel-caption text-start container">
          <div>
            <a href="/register" className="btn btn-lg btn-primary me-2">Register</a>
            <a href="/login" className="btn btn-lg btn-primary">Login</a>
          </div>
          <h1>
            Welcome to
            <br /> <span className="highlight">Department</span>
            <span className="highlight">of Power</span>
            <br />
            Government of West Bengal
          </h1>
          
        </div>
      </div>
      {/* ✅ Slide 2 */}
      <div className="carousel-item">
        <img
          src="./images/banner2.png"
          className="d-block w-100"
          alt="Banner 2"
        />
        <div className="carousel-caption text-start  container">
          <h1>
            Empowering
            <br /> <span className="highlight">West Bengal</span>
            Towards a <br />
            <span className="highlight">Brighter Future</span>
          </h1>
          <div className="mt-4">
            <a href="/register" className="btn btn-lg btn-primary me-2">Register</a>
            <a href="/contact_us" className="btn btn-lg btn-outline-light">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
    {/* ✅ Carousel Controls */}
    <button
      className="carousel-control-prev"
      type="button"
      data-bs-target="#heroCarousel"
      data-bs-slide="prev"
    >
      <span className="carousel-control-prev-icon" aria-hidden="true" />
      <span className="visually-hidden">Previous</span>
    </button>
    <button
      className="carousel-control-next"
      type="button"
      data-bs-target="#heroCarousel"
      data-bs-slide="next"
    >
      <span className="carousel-control-next-icon" aria-hidden="true" />
      <span className="visually-hidden">Next</span>
    </button>
  </div>
</section></>
}
export default HeroBanner;
