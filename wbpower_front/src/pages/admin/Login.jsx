import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/api";
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setFormError(null);

    // client-side validation
    const localErrors = {};
    if (!email) localErrors.email = ["Email is required."];
    else if (!/^\S+@\S+\.\S+$/.test(email)) localErrors.email = ["Please enter a valid email address."];
    if (!password) localErrors.password = ["Password is required."];

    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      setLoading(false);
      return;
    }

    try {
      // Call Laravel API
      const response = await api.post("/login", { email, password });

      if (response.data.access_token) {
        const token = response.data.access_token;
        localStorage.setItem("token", token);
        dispatch(login({ token }));
        navigate("/admin/dashboard"); // redirect to admin dashboard
      } else {
        setFormError("Invalid login response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const resp = err?.response;
      if (resp?.status === 422 && resp?.data?.errors) {
        setErrors(resp.data.errors);
      } else if (resp?.status === 401) {
        setFormError(resp.data?.message || 'Invalid credentials.');
      } else {
        setFormError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded-xl p-6 w-96">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <div>
          <input
            type="email"
            placeholder="Email"
            className={`w-full mb-3 p-2 border rounded ${errors?.email ? 'border-danger' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors?.email && <div className="text-danger small mb-2">{errors.email.join(', ')}</div>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className={`w-full mb-3 p-2 border rounded ${errors?.password ? 'border-danger' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors?.password && <div className="text-danger small mb-2">{errors.password.join(', ')}</div>}
        </div>

        {formError && <div className="text-danger small mb-2">{formError}</div>}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}