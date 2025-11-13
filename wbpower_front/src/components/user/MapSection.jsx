import React, { useState } from "react";

const MapSection = () => {
  const [active, setActive] = useState("HYDRO");

  const buttons = [
    { label: "HYDRO", img: "/images/m1.png" },
    { label: "SOLAR", img: "/images/m2.png" },
    { label: "THERMAL", img: "/images/m3.png" },
    { label: "PUMPED STORAGE", img: "/images/m4.png" },
  ];

  return (
    <section className="map-section container-fluid py-4">
      <div className="container map-section1">
        <div className="row align-items-center">
          <div className="col-md-6 col-12">
            <h5 className="section-heading mb-0">Power Stations of West Bengal</h5>
          </div>
          <div className="col-md-6 col-12 text-end">
            <button className="district-btn">
              <img src="/images/map-img.png" alt="icon" /> District wise 33/11 KV Sub Stations
            </button>
          </div>
        </div>
      </div>

      <div className="row justify-content-center align-items-center img-fluid map-image">
        <div className="col-lg-10 col-md-10 col-12 position-relative">
          <div className="map-buttons d-flex flex-lg-column flex-row flex-wrap gap-3 position-absolute end-0 top-50 translate-middle-y me-3">
            {buttons.map((btn) => (
              <button
                key={btn.label}
                className={`circle-btn ${active === btn.label ? "active" : ""}`}
                onClick={() => setActive(btn.label)}
              >
                <img src={btn.img} alt={btn.label} />
                <span className="circle-text">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
