import React from "react";

const AboutSection = () => (
 <section className="about-section">
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
          <h2> ⚡About us</h2>
          <p>
            The West Bengal Power Development Corporation Limited (WBPDCL) is
            the state-owned power company of West Bengal. It was established in
            1985 to meet the electricity needs of the state. WBPDCL operates
            major thermal power plants like Kolaghat, Bakreswar, Sagardighi, and
            Santaldih. It also focuses on modernization and renewable energy for
            sustainable growth.
          </p>
          <button className="btn-read">
            Read More
            <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

);
export default AboutSection;
