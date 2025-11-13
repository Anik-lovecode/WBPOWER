import React from "react";

const PowerSection = () => (
  <section className="power-section py-5">
    <div className="container">
      <div className="row align-items-center g-4">
        <div className="col-lg-6 col-md-12">
          <div className="left-box p-4 shadow-sm">
            <h6 className="text-warning fw-bold mb-2">⚡ WHAT WE DO</h6>
            <h5 className="text-dangerh mb-3">
              The Department of Power, Government of West Bengal
            </h5>
            <p className="text-dark small-text mb-2">
              Established in 1972 to strengthen electricity infrastructure across West Bengal...
            </p>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 right-bg d-flex align-items-center">
          <div className="important-pages bg-overlay p-4 rounded">
            <h6 className="fw-bold mb-3">Important Pages</h6>
            <ul className="timeline list-unstyled m-0 fw-medium">
              {["Grievance", "License Renewal", "EODB", "Lift & Escalator", "Feedback"].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default PowerSection;
