import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function CustomPostForm() {
  const { tableName, id } = useParams();
  const mode = id ? "edit" : "create";

  const navigate = useNavigate();

  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    if (!tableName) {
      setError("No table name specified.");
      setLoading(false);
      return;
    }

    if (mode === "edit" && !id) {
      setError("No ID specified for edit mode.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fieldRes = await api.get(`/custom-post-form-fields/${tableName}`);
        const fields = fieldRes.data?.fields || [];
        setFormFields(fields);

        const initialData = {};
        fields.forEach((f) => {
          initialData[f.name] = "";
        });

        if (mode === "edit") {
          const postRes = await api.get(`/custom-post/details/${tableName}/${id}`);
          const postData = postRes.data?.data || postRes.data || {};

          fields.forEach((field) => {
            initialData[field.name] = postData[field.name] ?? "";
          });

          const filePreviews = {};
          fields.forEach((field) => {
            if (field.type === "file" && initialData[field.name]) {
              const baseUrl = import.meta.env.VITE_IMG_URL || "";
              const imageUrl = initialData[field.name].startsWith("http")
                ? initialData[field.name]
                : `${baseUrl}/${initialData[field.name]}`;
              filePreviews[field.name] = imageUrl;
            }
          });
          setPreviews(filePreviews);
        }

        setFormData(initialData);
      } catch (err) {
        console.error("Failed to fetch form data:", err);
        setError("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      Object.values(previews).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [tableName, id, mode]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (files && files[0]) {
        const file = files[0];
        setFormData((prev) => ({ ...prev, [name]: file }));
        const objectUrl = URL.createObjectURL(file);
        setPreviews((prev) => {
          if (prev[name] && prev[name].startsWith("blob:")) {
            URL.revokeObjectURL(prev[name]);
          }
          return { ...prev, [name]: objectUrl };
        });
      } else {
        setFormData((prev) => ({ ...prev, [name]: "" }));
        setPreviews((prev) => {
          if (prev[name] && prev[name].startsWith("blob:")) {
            URL.revokeObjectURL(prev[name]);
          }
          return { ...prev, [name]: null };
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear field error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCKEditorChange = (name, data) => {
    setFormData((prev) => ({ ...prev, [name]: data }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    formFields.forEach((field) => {
      const value = formData[field.name];
      if (field.required) {
        if (field.type === "file" && mode === "create" && !value) {
          newErrors[field.name] = `${field.label || field.name} is required`;
        } else if (!value || value === "") {
          newErrors[field.name] = `${field.label || field.name} is required`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      const endpoint =
        mode === "create"
          ? `/custom-post/create/${tableName}`
          : `/custom-post/update/${tableName}/${id}`;

      const response = await api.post(endpoint, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        navigate(`/custom-post-list/${tableName}`);
      } else {
        setError("Submission failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div>
      <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 top-7">
        <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
          <h6 className="text-white text-capitalize ps-3">
            {mode === "edit" ? "Edit" : "Create"} Custom Post: {tableName}
          </h6>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-center my-2 font-semibold">{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="mx-auto p-frm bg-white rounded-2xl shadow-lg font-sans"
      >
        {formFields.map((field, index) => {
          const hasError = !!errors[field.name];
          const borderClass = hasError ? "border-red-500" : "border-gray-300";

          return (
            <div key={index} className="flex flex-col mb-4">
              <label
                htmlFor={field.name}
                className="block mb-1 font-medium text-gray-700"
              >
                {field.label || field.name}
              </label>

              {field.type === "text" && (
                <input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  className={`w-full px-2 py-2 border rounded-lg ${borderClass}`}
                  placeholder={field.placeholder || field.label}
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  className={`px-4 py-2 border rounded-md ${borderClass}`}
                  placeholder={field.placeholder || field.label}
                />
              )}

              {field.type === "richtext" && (
                <div className={`border rounded-md ${borderClass}`}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData[field.name] || ""}
                    onChange={(event, editor) =>
                      handleCKEditorChange(field.name, editor.getData())
                    }
                  />
                </div>
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  className={`px-4 py-2 border rounded-md ${borderClass}`}
                  placeholder={field.placeholder || field.label}
                />
              )}

              {field.type === "select" && Array.isArray(field.options) && (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  className={`px-4 py-2 border rounded-md ${borderClass}`}
                >
                  <option value="" disabled>
                    {field.placeholder || `Select ${field.label}`}
                  </option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "file" && (
                <div className="w-full flex justify-start items-start space-x-4 gap-3">
                  <div className="basis-3/4">
                    <input
                      type="file"
                      id={field.name}
                      name={field.name}
                      onChange={handleInputChange}
                      className={`block px-2 py-2 border rounded-lg w-full cursor-pointer focus:outline-none ${borderClass}`}
                    />
                  </div>
                  <div>
                    {previews[field.name] && (
                      <img
                        src={previews[field.name]}
                        alt={`${field.label || field.name} preview`}
                        className="w-20 h-20 rounded-md object-cover border"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "150px",
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {hasError && (
                <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          disabled={submitting}
          className={`p-head w-btn py-2 text-white font-semibold rounded-lg transition ${
            submitting
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {submitting ? "Submitting..." : mode === "edit" ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}
