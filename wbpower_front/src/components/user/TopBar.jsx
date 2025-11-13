import React from "react";

const TopBar = () => (
  <div className="top-bar py-1 px-3 d-flex justify-content-between align-items-center">
    <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div className="d-flex gap-2">
        <span>STATE IN REG. LANGUAGE</span>
        <span>|</span>
        <span>GOVERNMENT OF STATE NAME</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="d-flex gap-2">
          <i className="bi bi-display"></i>
          <i className="bi bi-search"></i>
          <i className="bi bi-person"></i>
          <i className="bi bi-translate"></i>
        </div>
        <div className="language-switch">ENGLISH</div>
      </div>
    </div>
  </div>
);

export default TopBar;
