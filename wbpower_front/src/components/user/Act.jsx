import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function Act() {
  const [fields, setFields] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  const tableName = "custompost_acts";

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const [fRes, rRes] = await Promise.all([
          api.get(`/custom-post-form-fields/${tableName}`),
          api.get(`/custom-post/list/${tableName}`),
        ]);

        if (!mounted) return;

        const fetchedFields = fRes.data?.fields || [];
        const fetchedRows = rRes.data?.data || rRes.data || [];

        setFields(fetchedFields);
        setRows(fetchedRows);
      } catch (err) {
        console.error("Failed to load acts:", err);
        setError("Failed to load acts.");
      } finally {
        mounted && setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading acts...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

  // Heuristics to choose which columns to display:
  const getFieldByCandidates = (cands) =>
    fields.find((f) => cands.some((c) => String(f.name).toLowerCase().includes(c)));

  const titleField = getFieldByCandidates(["title", "name"]) || fields.find((f) => f.type === "text" || f.type === "text") || fields[0];
  const contentField = getFieldByCandidates(["content", "description", "body"]) || fields.find((f) => f.type === "textarea" || f.type === "richtext") || fields[1] || fields[0];
  const extraField = fields.find((f) => ["extra_content", "extra", "more"].includes(String(f.name).toLowerCase()));
  const fileFields = fields.filter((f) => f.type === "file" || /(image|file|document|attachment|support)/i.test(f.name));

  const imgBase = import.meta.env.VITE_IMG_URL || "";

  const truncate = (str, n = 300) => {
    if (!str) return "";
    return str.length > n ? str.slice(0, n) + "..." : str;
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="about-section">
      <div className="container">
        <h2 className="mb-4">Acts</h2>

        <div style={{ overflowX: "auto" }}>
          <table className="w-full table-auto bg-white shadow">
            <thead className="bg-gray-100" style={{ fontSize: "18px", fontFamily: "Arial, sans-serif", fontWeight: "bold", color: "#20145D"  }}>
              <tr>
                <th style={{ textAlign: "left", padding: 12 }}>
                  {titleField?.label || titleField?.name || "Title"}
                </th>

                <th style={{ textAlign: "left", padding: 12 }}>
                  {contentField?.label || contentField?.name || "Content"}
                </th>

                <th style={{ textAlign: "left", padding: 12 }}>
                  Supporting Documents
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const id = row.id;
                const titleVal = row[titleField?.name] ?? "";
                const contentVal = row[contentField?.name] ?? "";
                const extraVal = extraField ? row[extraField.name] : null;

                return (
                  <tr key={id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: 12, verticalAlign: "top", width: "25%", fontWeight: 600 }}>{titleVal}</td>
                    <td style={{ padding: 12, verticalAlign: "top", width: "55%" }}>
                      <div>
                        <div dangerouslySetInnerHTML={{ __html: truncate(String(contentVal || ""), 400) }} />
                        {extraVal && !expanded[id] && (
                          <div>
                            <button className="btn-read mt-2" onClick={() => toggleExpand(id)}>
                              Read more
                            </button>
                          </div>
                        )}
                        {expanded[id] && (
                          <div className="mt-2">
                            <div dangerouslySetInnerHTML={{ __html: String(contentVal || "") }} />
                            {extraVal && <div style={{ marginTop: 8 }} dangerouslySetInnerHTML={{ __html: String(extraVal) }} />}
                            <div>
                              <button className="btn-read mt-2" onClick={() => toggleExpand(id)}>
                                Show less
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: 12, verticalAlign: "top", width: "20%" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {fileFields.length === 0 && <div>No supporting documents</div>}
                        {fileFields.map((f) => {
                          const val = row[f.name];
                          if (!val) return null;
                          // handle array of files or single string
                          const files = Array.isArray(val) ? val : [val];
                          return files.map((p, idx) => {
                            const href = String(p).startsWith("http") ? p : `${imgBase}/${p}`;
                            const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(p);
                            const isPdf = /\.pdf$/i.test(String(p));
                            return (
                              <div key={`${f.name}-${id}-${idx}`}>
                                {isImage ? (
                                  <a href={href} target="_blank" rel="noreferrer">
                                    <img src={href} alt="doc" style={{ maxWidth: 140, maxHeight: 120, objectFit: "cover", borderRadius: 6 }} />
                                  </a>
                                ) : isPdf ? (
                                  <a href={href} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                    <i className="fa-solid fa-file-pdf" style={{ fontSize: 48, color: 'red' }} aria-hidden="true"></i>
                                    <span>Download PDF</span>
                                  </a>
                                ) : (
                                  <a href={href} target="_blank" rel="noreferrer">Download document</a>
                                )}
                              </div>
                            );
                          });
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}