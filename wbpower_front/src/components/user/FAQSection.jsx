import React from "react";

const faqs = [
  {
    q: "How can I apply for a CEI Safety Approval License?",
    a: "You can apply through the official Department of Power online portal.",
  },
  {
    q: "Where can I check the status of a submitted grievance?",
    a: "You can track grievances on the Department’s official portal under “Grievance Status.”",
  },
];

const FAQSection = () => (
  <section className="faq-section text-white py-5">
    <div className="container position-relative">
      <div className="row align-items-center">
        <div className="col-lg-5 col-md-12 mb-4 mb-lg-0">
          <h2 className="fw-bold mb-3">Frequently asked questions</h2>
          <p className="mb-4">Would you like a more formal, playful, or minimalist tone?</p>
          <a href="#" className="btn btn-light d-inline-flex align-items-center text-white">
            SEE PROJECTS <span className="btn-arrow ms-2"><i className="fa-solid fa-angle-right"></i></span>
          </a>
        </div>
        <div className="col-lg-7 col-md-12">
          <div className="accordion" id="faqAccordion">
            {faqs.map((f, i) => (
              <div className="accordion-item" key={i}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faq${i}`}
                  >
                    {f.q}
                  </button>
                </h2>
                <div id={`faq${i}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body text-dark">{f.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default FAQSection;
