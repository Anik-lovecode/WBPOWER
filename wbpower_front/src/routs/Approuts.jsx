// src/routes/AppRoutes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/user/Home";

import DynamicPage from "../pages/DynamicPage";

// If you have other routes, keep them here too.
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Your dynamic page route */}
        <Route path="/" element={<Home />} />
        <Route path="/page/:slug" element={<DynamicPage />} />
        <Route path="/page" element={<DynamicPage />} />

        {/* optional: redirect old ContactUs path to the dynamic one */}
        {/* <Route path="/contact-us" element={<Navigate to="/page/contact" replace />} /> */}

        {/* Fallback route — you may keep your other app routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}
