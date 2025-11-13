import React from 'react'

const Info = () => {
  return (
    <section className="info-section">
  <div className="container">
    <div className="row g-4">
      {/* Card 1 */}
      <div className="col-lg-4 col-md-6">
        <div className="info-card">
          <div className="info-icon">
            <img src="./images/icon1.png" className="" alt="icon" />
          </div>
          <h6 className="info-title">Reports / Publication</h6>
          <ul>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </li>
            <li>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris.
            </li>
            <li>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum.
            </li>
          </ul>
          <a href="#" className="view-link">
            View All <span>➜</span>
          </a>
        </div>
      </div>
      {/* Card 2 */}
      <div className="col-lg-4 col-md-6">
        <div className="info-card">
          <div className="info-icon">
            <img src="./images/icon2.png" className="" alt="icon" />
          </div>
          <h6 className="info-title">Services / Scheme</h6>
          <ul>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </li>
            <li>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris.
            </li>
            <li>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum.
            </li>
          </ul>
          <a href="#" className="view-link">
            View All <span>➜</span>
          </a>
        </div>
      </div>
      {/* Card 3 */}
      <div className="col-lg-4 col-md-6">
        <div className="info-card">
          <div className="info-icon">
            <img src="./images/icon3.png" className="" alt="icon" />
          </div>
          <h6 className="info-title">Important / Quick Links</h6>
          <ul>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </li>
            <li>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris.
            </li>
            <li>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum.
            </li>
          </ul>
          <a href="#" className="view-link">
            View All <span>➜</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

  )
}

export default Info
