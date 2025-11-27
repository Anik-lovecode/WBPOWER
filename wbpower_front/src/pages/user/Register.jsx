import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../api/api';
import { login, fetchUser } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // If already logged in (token exists) immediately redirect to admin dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    user_address: '',
    password: '',
    password_confirmation: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = e => setFile(e.target.files?.[0] ?? null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    // Client-side validation
    const localErrors = {};
    // phone validation if provided
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      localErrors.phone = ["Mobile number must be exactly 10 digits."];
    }
    // password confirmation check
    if (form.password !== form.password_confirmation) {
      localErrors.password = ["Passwords do not match."];
    }

    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      return;
    }
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(form).forEach((k) => data.append(k, form[k]));
      if (file) data.append('user_image', file);
      // default role for public registration
      data.append('user_role', 'user');

      const res = await api.post('/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

        if (res?.data?.access_token) {
        const token = res.data.access_token;
        // save token and update auth state
        dispatch(login({ token }));
        // fetch user profile immediately
        dispatch(fetchUser());
        // optionally fetch user in background (authSlice will do it)
        navigate('/');
      } else {
        alert('Registration succeeded but no token returned. Please login.');
        navigate('/login');
      }
    } catch (err) {
      if (err?.response?.data?.errors) setErrors(err.response.data.errors);
      else if (err?.response?.data?.message) alert(err.response.data.message);
      else console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="row justify-center">
        <div className="col-md-8 mx-auto">
          <div className="card shadow-sm">
            <div className="card-body p-6">
              <h2 className="mb-4">Register</h2>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
                  <div className="text-danger small">{errors?.name && errors.name.join(', ')}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" className="form-control" required />
                  <div className="text-danger small">{errors?.email && errors.email.join(', ')}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="form-control" />
                  <div className="text-danger small">{errors?.phone && errors.phone.join(', ')}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input name="user_address" value={form.user_address} onChange={handleChange} className="form-control" required />
                  <div className="text-danger small">{errors?.user_address && errors.user_address.join(', ')}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Profile Image (optional)</label>
                  <input type="file" onChange={handleFile} className="form-control" accept="image/*" />
                  <div className="text-danger small">{errors?.user_image && errors.user_image.join(', ')}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input name="password" value={form.password} onChange={handleChange} type="password" className={`form-control ${errors?.password ? 'is-invalid' : ''}`} required />
                  <div className="text-danger small">{errors?.password && errors.password.join(', ')}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input name="password_confirmation" value={form.password_confirmation} onChange={handleChange} type="password" className={`form-control ${errors?.password ? 'is-invalid' : ''}`} required />
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary" disabled={loading} type="submit">
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                  <a className="btn btn-outline-secondary" href="/login">Already have an account?</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
