import React from 'react'

const Act = () => {
  return (
    <div><section className="about-section">
  <div className="container">
    <div className="row align-items-center g-4">
      {/* Left Image */}
      <div className="col-lg-6 text-center">
        <div className="about-img">
          <img
            src="./images/about-img.png"
            alt="About WBPDCL"
            className="img-fluid"
          />
        </div>
      </div>
      {/* Right Content */}
      <div className="col-lg-6">
        <div className="about-content">
          <h2> ⚡Act</h2>
          <p>
            Acts
            . 
            . 
            . 
          </p>
          <button className="btn-read">
            Read More
            <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</section></div>
  )
}

export default Act