
import React from "react";

export default function OfficeInfo() {
  return (
    <section className="office-info" style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Government of West Bengal</h2>
        <h3 style={styles.subHeading}>Department of Power</h3>

        <div style={styles.addressBox}>
          <p style={styles.line}>Bidyut Unnayan Bhavan</p>
          <p style={styles.line}>3/C, LA Block, 5th & 6th Floor,</p>
          <p style={styles.line}>Sector-III, Salt Lake City, Kolkata - 700 106</p>
        </div>

        <div style={styles.emailBox}>
          <p style={styles.line}>
            <strong>Email:</strong> receiptpowerdepartment@gmail.com / powerdept@wb.gov.in
          </p>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "50px 0",
    background: "#f7f7f7",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "center",
    padding: "0 20px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#333",
  },
  subHeading: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#555",
  },
  addressBox: {
    marginBottom: "15px",
  },
  emailBox: {
    marginTop: "10px",
  },
  line: {
    fontSize: "18px",
    margin: "4px 0",
    color: "#444",
  },
};





// // OfficeInfo.jsx
// import React from 'react';
// import PropTypes from 'prop-types';

// /**
//  * Props:
//  * - office: {
//  *     title?: string,
//  *     lines?: string[],         // address lines
//  *     phone?: string,
//  *     emails?: string|array
//  *   }
//  */
// export default function OfficeInfo({ office }) {
//   if (!office) return null;

//   const emails = Array.isArray(office.emails) ? office.emails.join(' / ') : office.emails;

//   return (
//     <div style={{ background: '#fff', padding: 12, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
//       <h3 style={{ margin: 0, marginBottom: 8, fontSize: 16 }}>Contact & Address</h3>

//       <div style={{ fontSize: 14, color: '#333', lineHeight: 1.5 }}>
//         {office.title && <div style={{ fontWeight: 700, marginBottom: 6 }}>{office.title}</div>}

//         {office.lines && office.lines.map((line, i) => (
//           <div key={i}>{line}</div>
//         ))}

//         {office.phone && <div style={{ marginTop: 8 }}>Phone: {office.phone}</div>}

//         {emails && <div style={{ marginTop: 6 }}>Email: {emails}</div>}
//       </div>
//     </div>
//   );
// }

// OfficeInfo.propTypes = {
//   office: PropTypes.shape({
//     title: PropTypes.string,
//     lines: PropTypes.arrayOf(PropTypes.string),
//     phone: PropTypes.string,
//     emails: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
//   }),
// };
