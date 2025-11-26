// ContactTable.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Props:
 * - contacts: array of { id, no, officer_name, designation, office_no, fax_no, email }
 * - onExportCsv: function to export CSV (optional)
 */
export default function ContactTable({ contacts = [], onExportCsv }) {
  const headers = ['NO.', 'OFFICER NAME', 'DESIGNATION', 'OFFICE NO', 'FAX NO', 'EMAIL'];

  const exportCsv = () => {
    if (typeof onExportCsv === 'function') return onExportCsv();
    // fallback simple CSV exporter
    if (!contacts || contacts.length === 0) return;
    const rows = contacts.map((c, idx) => ([
      c.no ?? idx + 1,
      c.officer_name ?? '',
      c.designation ?? '',
      c.office_no ?? '',
      c.fax_no ?? '',
      c.email ?? '',
    ]));
    const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto', background: '#fff', borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="Contact list">
        <thead style={{ background: '#f7f7f7' }}>
          <tr>
            {headers.map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#444', fontWeight: 700 }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: 20, textAlign: 'center', color: '#666' }}>No contact data available.</td>
            </tr>
          ) : (
            contacts.map((c, idx) => (
              <tr key={c.id ?? idx} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: '10px 12px' }}>{c.no ?? idx + 1}</td>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{c.officer_name}</td>
                <td style={{ padding: '10px 12px' }}>{c.designation}</td>
                <td style={{ padding: '10px 12px' }}>{c.office_no ?? '--'}</td>
                <td style={{ padding: '10px 12px' }}>{c.fax_no ?? '--'}</td>
                <td style={{ padding: '10px 12px', color: '#0b61a4' }}>{c.email ?? '--'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 8 }}>
        <button
          onClick={exportCsv}
          type="button"
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}

ContactTable.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object),
  onExportCsv: PropTypes.func,
};
