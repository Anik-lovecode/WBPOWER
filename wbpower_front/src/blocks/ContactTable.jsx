// components/user/contact_us/ContactTable.jsx
// Requires: npm install xlsx jspdf jspdf-autotable file-saver

import React, { useMemo, useState, useRef } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ContactTable() {
  const rawOfficers = [
    { no: 1, name: "Shri Aroop Biswas", designation: "Minister-in-charge", office: "(033) 2335-0768", fax: "(033) 2335-5151", email: "micpowerwb1@gmail.com" },
    { no: 2, name: "Janab Akhruzzaman", designation: "Minister of State", office: "(033) 2339-3235", fax: "(033) 2339-3236", email: "mospower21@gmail.com" },
    { no: 3, name: "Shri Santanu Basu, IAS", designation: "Principal Secretary", office: "(033) 2335-1269 / (033) 2339-3631", fax: "(033) 2335 8378", email: "powersecy@wb.gov.in" },
    { no: 4, name: "Shri Anjan Chakrabarti, WBCS (Exe.)", designation: "Special Secretary", office: "(033) 2339-3645", fax: "--", email: "addlsecy.power@wb.gov.in" },
    { no: 5, name: "Shri Pralay Majumdar, WBCS (Exe.)", designation: "Additional Secretary", office: "(033) 2339 3629", fax: "--", email: "js2powerwb@gmail.com" },
    { no: 6, name: "Shri Ranjan Chakraborty, WBCS (Exe.)", designation: "Joint Secretary", office: "(033) 2339 3681", fax: "--", email: "jtsecy.power@wb.gov.in" },
    { no: 7, name: "Shri Lalbahadur Sardar, WBA&AS", designation: "Financial Advisor", office: "(033) 2339 3682", fax: "--", email: "fa2-power-wb@gov.in" },
    { no: 8, name: "Smt. Sharmistha Chatterjee, WBA&AS", designation: "Dy. Financial Advisor", office: "(033) 2339 3696", fax: "--", email: "dfa.power@wb.gov.in" },
    { no: 9, name: "Shri Pradyut Kumar Das, WBSS", designation: "Deputy Secretary", office: "(033) 2339 3330", fax: "--", email: "ds.power.wb@gmail.com" },
    { no: 10, name: "Shri Rajarshi Basak, WBSS", designation: "Assistant Secretary", office: "(033) 2339 3616", fax: "--", email: "as-power-wb@gov.in" },
    { no: 11, name: "Shri Debashis Gangopadhyay, WBSS", designation: "Assistant Secretary", office: "(033) 2339 3698", fax: "--", email: "as2-power-wb@gov.in" },
    { no: 12, name: "Shri Tofikul Islam, WBSS", designation: "Registrar", office: "(033) 2339 3615", fax: "--", email: "regr.power@wb.gov.in" },
    { no: 13, name: "Shri Saurav Sarkar, WBES", designation: "Chief Electrical Inspector, DOE", office: "(033) 2262-5052 / (033) 2262-5053", fax: "(033) 2262-5053", email: "doe.cei.wb@gmail.com, cei.doe-wb@gov.in" },
  ];

  const [query, setQuery] = useState("");
  const [officers] = useState(rawOfficers);
  const tableRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return officers;
    const q = query.toLowerCase();
    return officers.filter((o) =>
      [String(o.no), o.name, o.designation, o.office, o.fax, o.email]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, officers]);

  // Export helpers
  const exportCSV = () => {
    const header = ["No.", "Officer Name", "Designation", "Office No", "Fax No", "Email"];
    const rows = filtered.map((r) => [r.no, r.name, r.designation, r.office, r.fax, r.email]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "contact-officers.csv");
  };

  const exportExcel = () => {
    const wsData = [
      ["No.", "Officer Name", "Designation", "Office No", "Fax No", "Email"],
      ...filtered.map((r) => [r.no, r.name, r.designation, r.office, r.fax, r.email]),
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Officers");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "contact-officers.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const title = "Office Contact Details - Department of Power, WB";
    doc.setFontSize(12);
    doc.text(title, 40, 40);

    const head = [["No.", "Officer Name", "Designation", "Office No", "Fax No", "Email"]];
    const body = filtered.map((r) => [r.no, r.name, r.designation, r.office, r.fax, r.email]);

    doc.autoTable({
      head,
      body,
      startY: 60,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      margin: { left: 40, right: 40 },
    });

    doc.save("contact-officers.pdf");
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Office Contact Details</h2>

          <div style={styles.controls}>
            <input
              aria-label="Search officers"
              placeholder="Search by name, designation, phone, email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={styles.search}
            />

            <div style={styles.buttons}>
              <button onClick={exportCSV} style={styles.btn}>Export CSV</button>
              <button onClick={exportExcel} style={styles.btn}>Export Excel</button>
              <button onClick={exportPDF} style={{ ...styles.btn, background: "#000" }}>Export PDF</button>
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }} ref={tableRef}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>No.</th>
                <th style={styles.th}>Officer Name</th>
                <th style={styles.th}>Designation</th>
                <th style={styles.th}>Office No</th>
                <th style={styles.th}>Fax No</th>
                <th style={styles.th}>Email</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 20, textAlign: "center" }}>
                    No results found
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.no} style={styles.row}>
                    <td style={styles.td}>{o.no}</td>
                    <td style={styles.td}>{o.name}</td>
                    <td style={styles.td}>{o.designation}</td>
                    <td style={styles.td}>{o.office}</td>
                    <td style={styles.td}>{o.fax || "--"}</td>
                    <td style={{ ...styles.td, whiteSpace: "pre-line" }}>{o.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
          Showing {filtered.length} of {officers.length} entries
        </p>
      </div>
    </section>
  );
}

const styles = {
  section: { padding: "30px 0", background: "#fff" },
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 20px" },
  headerRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" },
  title: { fontSize: 24, margin: 0 },
  controls: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  search: { padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", minWidth: 260 },
  buttons: { display: "flex", gap: 8 },
  btn: { padding: "8px 12px", borderRadius: 6, border: "none", background: "#333", color: "#fff", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: 16, fontSize: 15 },
  theadRow: { background: "#d6d330", color: "#000" },
  th: { textAlign: "left", padding: "10px 12px", fontWeight: 700, borderBottom: "2px solid #eee" },
  row: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "10px 12px", verticalAlign: "top" },
};









// // ContactTable.jsx
// import React from 'react';
// import PropTypes from 'prop-types';

// /**
//  * Props:
//  * - contacts: array of { id, no, officer_name, designation, office_no, fax_no, email }
//  * - onExportCsv: function to export CSV (optional)
//  */
// export default function ContactTable({ contacts = [], onExportCsv }) {
//   const headers = ['NO.', 'OFFICER NAME', 'DESIGNATION', 'OFFICE NO', 'FAX NO', 'EMAIL'];

//   const exportCsv = () => {
//     if (typeof onExportCsv === 'function') return onExportCsv();
//     // fallback simple CSV exporter
//     if (!contacts || contacts.length === 0) return;
//     const rows = contacts.map((c, idx) => ([
//       c.no ?? idx + 1,
//       c.officer_name ?? '',
//       c.designation ?? '',
//       c.office_no ?? '',
//       c.fax_no ?? '',
//       c.email ?? '',
//     ]));
//     const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'contacts.csv';
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div style={{ width: '100%', overflowX: 'auto', background: '#fff', borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
//       <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="Contact list">
//         <thead style={{ background: '#f7f7f7' }}>
//           <tr>
//             {headers.map(h => (
//               <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#444', fontWeight: 700 }}>
//                 {h}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {contacts.length === 0 ? (
//             <tr>
//               <td colSpan={6} style={{ padding: 20, textAlign: 'center', color: '#666' }}>No contact data available.</td>
//             </tr>
//           ) : (
//             contacts.map((c, idx) => (
//               <tr key={c.id ?? idx} style={{ borderTop: '1px solid #eee' }}>
//                 <td style={{ padding: '10px 12px' }}>{c.no ?? idx + 1}</td>
//                 <td style={{ padding: '10px 12px', fontWeight: 600 }}>{c.officer_name}</td>
//                 <td style={{ padding: '10px 12px' }}>{c.designation}</td>
//                 <td style={{ padding: '10px 12px' }}>{c.office_no ?? '--'}</td>
//                 <td style={{ padding: '10px 12px' }}>{c.fax_no ?? '--'}</td>
//                 <td style={{ padding: '10px 12px', color: '#0b61a4' }}>{c.email ?? '--'}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 8 }}>
//         <button
//           onClick={exportCsv}
//           type="button"
//           style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
//         >
//           Export CSV
//         </button>
//       </div>
//     </div>
//   );
// }

// ContactTable.propTypes = {
//   contacts: PropTypes.arrayOf(PropTypes.object),
//   onExportCsv: PropTypes.func,
// };
