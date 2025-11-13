import React from "react";

const Navbar = () => {
  return <nav className="navbar navbar-expand-lg fixed-top position-absolute navbar-dark">
    <div className="container">
      {/* Mobile toggle button */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Navbar links */}
      <div className=" navbar-collapse justify-content-center" id="navbarNavDropdown">
        <ul className="navbar-nav gap-lg-1">
          {/* Regular links */}
          <li className="nav-item">
            <a className="nav-link" href="#">Home</a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#">About Us</a>
          </li>

          {/* Dropdown: Policy */}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="policyDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Policy
            </a>
            <ul className="dropdown-menu" aria-labelledby="policyDropdown">
              <li><a className="dropdown-item" href="#">Policy 1</a></li>
              <li><a className="dropdown-item" href="#">Policy 2</a></li>
              <li><a className="dropdown-item" href="#">Policy 3</a></li>
            </ul>
          </li>

          {/* Dropdown: Acts & Rules / Guidelines */}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="actsDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Acts & Rules / Guidelines
            </a>
            <ul className="dropdown-menu" aria-labelledby="actsDropdown">
              <li><a className="dropdown-item" href="#">Acts</a></li>
              <li><a className="dropdown-item" href="#">Rules</a></li>
              <li><a className="dropdown-item" href="#">Guidelines</a></li>
            </ul>
          </li>

          {/* Dropdown: Schemes & Projects */}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="schemesDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Schemes & Projects
            </a>
            <ul className="dropdown-menu" aria-labelledby="schemesDropdown">
              <li><a className="dropdown-item" href="#">Scheme 1</a></li>
              <li><a className="dropdown-item" href="#">Scheme 2</a></li>
              <li><a className="dropdown-item" href="#">Scheme 3</a></li>
            </ul>
          </li>

          {/* Dropdown: Departmental Units */}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="unitsDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Departmental Units
            </a>
            <ul className="dropdown-menu" aria-labelledby="unitsDropdown">
              <li><a className="dropdown-item" href="#">Unit 1</a></li>
              <li><a className="dropdown-item" href="#">Unit 2</a></li>
              <li><a className="dropdown-item" href="#">Unit 3</a></li>
            </ul>
          </li>

          {/* Dropdown: Citizen Corner */}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="citizenDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Citizen Corner
            </a>
            <ul className="dropdown-menu" aria-labelledby="citizenDropdown">
              <li><a className="dropdown-item" href="#">Service 1</a></li>
              <li><a className="dropdown-item" href="#">Service 2</a></li>
              <li><a className="dropdown-item" href="#">Service 3</a></li>
            </ul>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#">Achievement</a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#">Announcement</a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#">Contact Us</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
}

export default Navbar;
