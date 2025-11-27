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
            A full-fledged Department of Power under Government of West Bengal came into being on 19th September, 1972. Until then, matters pertaining to power were being looked after by the Electricity Development Directorate under the Department of Commerce & Industries. The driving forces/factors behind the decision to create a separate department under the stewardship of a Minister-in-charge of cabinet rank were:</p>

<p>Urgent requirement of more power for accelerating the economic growth of the state</p>
<p>Need for long term perspective planning for generation of power and execution of power projects</p>
<p>Planning and overseeing appropriate investments in the power sector, both in the public and private domains</p>
Enactment of appropriate legislation and framing of rules to facilitate the expeditious development of infrastructure in generation, transmission and distribution of electricity in the state
Need for coordinating and dovetailing the activities of various power generation and distribution utilities in the state cohesively
The Non-conventional Energy Sources wing was transferred to this department on 18th April of 2001 from the Department of Science & Technology to ensure better co-ordination and integration of renewable energy in the overall development of the sector. The Department has drawn up ambitious plans for installing 100 MW Grid Connected Ground Mounted Solar PV Power Plant and Grid Connected Roof top Solar PV Power Plants.

The process of reforms in power sector in West Bengal began in 2005, with restructuring of erstwhile West Bengal State Electricity Board (WBSEB) into the Transmission and Distribution utilities in 2007:

<p>West Bengal State Electricity Distribution Company Ltd. (WBSEDCL) – Distribution Company</p>
<p>West Bengal State Electricity Transmission Company Ltd. (WBSETCL) – Transmission Company</p>
<p>The generation function of erstwhile state utility has been organized under a separate entity, West Bengal Power Development Corporation Ltd. (WBPDCL). Established in 1985, WBPDCL is responsible for thermal power generation in the State, while hydro generation being undertaken by the then WBSEB till the time of unbundling has been currently transferred to WBSEDCL.

The State Regulatory Commission, West Bengal State Electricity Regulatory Commission (WBERC) was established in 1999.

Department of Power is at present functioning from The Bidyut Unnayan Bhavan (5th Floor), 3/C, LA Block, Sector-III Salt Lake City, Kolkata-700 098.

The State is now in a position to export power to other states after meeting its internal demand fully and the surplus power in often banked with the states having deficits and the same is returned to the state in the critical summer months.

Many more power projects are coming up, suitably programmed to meet the projected demand growth until the end of the 13th plan period.

The stress, now, is on the commensurate strengthening of the transmission and distribution network in the state to widely disperse the availability of quality power, amongst 1.8 crore consumers, especially in rural Bengal. Development of a state-of-the-art IT facility with state-wide coverage has already been undertaken which has resulted in improvement of consumer services by the various utilities in the state. Steps have also been taken for implementation of ERP and other IT interventions which will revolutionize the way the business is conducted in these utilities and the Directorates.
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
