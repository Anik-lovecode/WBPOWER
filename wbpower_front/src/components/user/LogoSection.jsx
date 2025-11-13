import React from "react";

const LogoSection = () => {
  const logos = [1, 2, 3, 4];
  return (
    <div className="logo-section py-3 px-3 d-flex flex-wrap justify-content-center align-items-center gap-4">
      {logos.map((i) => (
        <img key={i} src={`/images/image-${i}.png`} alt={`Logo ${i}`} className="logo-img" />
      ))}
    </div>
  );
};
export default LogoSection;
