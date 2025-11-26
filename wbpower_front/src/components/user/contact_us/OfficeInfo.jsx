// OfficeInfo.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Props:
 * - office: {
 *     title?: string,
 *     lines?: string[],         // address lines
 *     phone?: string,
 *     emails?: string|array
 *   }
 */
export default function OfficeInfo({ office }) {
  if (!office) return null;

  const emails = Array.isArray(office.emails) ? office.emails.join(' / ') : office.emails;

  return (
    <div style={{ background: '#fff', padding: 12, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <h3 style={{ margin: 0, marginBottom: 8, fontSize: 16 }}>Contact & Address</h3>

      <div style={{ fontSize: 14, color: '#333', lineHeight: 1.5 }}>
        {office.title && <div style={{ fontWeight: 700, marginBottom: 6 }}>{office.title}</div>}

        {office.lines && office.lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}

        {office.phone && <div style={{ marginTop: 8 }}>Phone: {office.phone}</div>}

        {emails && <div style={{ marginTop: 6 }}>Email: {emails}</div>}
      </div>
    </div>
  );
}

OfficeInfo.propTypes = {
  office: PropTypes.shape({
    title: PropTypes.string,
    lines: PropTypes.arrayOf(PropTypes.string),
    phone: PropTypes.string,
    emails: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  }),
};
