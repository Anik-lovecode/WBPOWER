import React from "react";

const NewsSection = () => (
 <div className="container py-5">
  <div className="row g-4 align-items-start">
    {/* Left */}
    <div className="col-lg-4 col-md-12">
      <h6 className="mb-3 nutxt">Projects &amp; Initiatives</h6>
      <div className="news-list mb-4">
        <div className="d-flex mb-3 align-items-center">
          <img
            src="./images/news1.png"
            alt="news"
            className="news-thumb me-3"
          />
          <div>
            <p className="mb-1 fw-semibold ntext">
              The challenges of the sowing campaign
            </p>
            <small className="text-muted">January 04, 2024</small>
          </div>
        </div>
        <div className="d-flex mb-3 align-items-center">
          <img
            src="./images/news1.png"
            alt="news"
            className="news-thumb me-3"
          />
          <div>
            <p className="mb-1 fw-semibold ntext">
              The challenges of the sowing campaign
            </p>
            <small className="text-muted">January 04, 2024</small>
          </div>
        </div>
        <div className="d-flex mb-3 align-items-center">
          <img
            src="./images/news1.png"
            alt="news"
            className="news-thumb me-3"
          />
          <div>
            <p className="mb-1 fw-semibold ntext">
              The challenges of the sowing campaign
            </p>
            <small className="text-muted">January 04, 2024</small>
          </div>
        </div>
      </div>
    </div>
    {/* Middle (tabs) */}
    <div className="col-lg-4 col-md-12">
      <div className="tab-box mt-4" aria-labelledby="tabs-label">
        <div id="tabs-label" className="visually-hidden">
          News Tenders Announcements Tabs
        </div>
        {/* buttons (role=tablist) */}
        <div className="tab-buttons" role="tablist" aria-label="Content tabs">
          <button
            type="button"
            className="active"
            role="tab"
            aria-selected="true"
            aria-controls="tab-news"
            data-tab="tab-news"
          >
            News
          </button>
          <button
            type="button"
            role="tab"
            aria-selected="false"
            aria-controls="tab-tenders"
            data-tab="tab-tenders"
          >
            Tenders
          </button>
          <button
            type="button"
            role="tab"
            aria-selected="false"
            aria-controls="tab-announcements"
            data-tab="tab-announcements"
          >
            Announcements
          </button>
        </div>
        {/* tab panels */}
        <div className="tab-content">
          <div
            id="tab-news"
            className="tab-panel"
            role="tabpanel"
            aria-labelledby=""
            data-panel=""
          >
            <ul>
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
              <li>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco.
              </li>
              <li>
                Duis aute irure dolor in reprehenderit in voluptate velit.
              </li>
              <li>Excepteur sint occaecat cupidatat non proident.</li>
              <li>Sed ut perspiciatis unde omnis iste natus error.</li>
            </ul>
          </div>
          <div
            id="tab-tenders"
            className="tab-panel d-none"
            role="tabpanel"
            data-panel=""
          >
            <ul>
              <li>New tender issued for infrastructure development.</li>
              <li>Bid submission deadline extended to next month.</li>
              <li>Guidelines for contractor eligibility updated.</li>
            </ul>
          </div>
          <div
            id="tab-announcements"
            className="tab-panel d-none"
            role="tabpanel"
            data-panel=""
          >
            <ul>
              <li>Official holiday notice for regional offices.</li>
              <li>Annual meeting scheduled for Q1 2025.</li>
              <li>Policy update regarding renewable energy incentives.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    {/* Right */}
    <div className="col-lg-4 col-md-12">
      <h6 className="mb-3 nutxt">Activities</h6>
      <div className="row g-3">
        <div className="col-6 col-md-6 ">
          <div className="card border-0 shadow-sm h-100">
            <img
              src="./images/news1.png"
              className="card-img-top"
              alt="Power"
            />
            <div className="card-body">
              <h6 className="card-title fw-semibold">
                The challenges of the sowing campaign
              </h6>
              <small className="text-muted d-block mb-2">
                January 04, 2024
              </small>
              <p className="small text-muted mb-2">
                The war has an impact not only on Ukraine’s food security, but
                also on...
              </p>
              <a href="#" className="text-danger fw-bold small">
                READ MORE
              </a>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-6 ">
          <div className="card border-0 shadow-sm h-100">
            <img
              src="./images/news2.png"
              className="card-img-top"
              alt="Energy"
            />
            <div className="card-body">
              <h6 className="card-title fw-semibold">
                The challenges of the sowing campaign
              </h6>
              <small className="text-muted d-block mb-2">
                January 04, 2024
              </small>
              <p className="small text-muted mb-2">
                The war has an impact not only on Ukraine’s food security, but
                also on...
              </p>
              <a href="#" className="text-danger fw-bold small">
                READ MORE
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

);
export default NewsSection;
