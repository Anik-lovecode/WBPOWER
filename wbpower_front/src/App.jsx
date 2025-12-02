// src/App.jsx
import React, { createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./redux/authSlice";
import "./index.css";

// Public login (only for Admin)
import AdminLayout from "./components/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import Post from "./pages/admin/PostListPage";
import PostForm from "./pages/admin/PostFormPage";
import PostCategory from "./pages/admin/PostCategoryListPage";
import PostCategoryForm from "./pages/admin/PostCategoryFormPage";
import Login from "./pages/admin/Login";
import UserProfileFormPage from "./pages/admin/UserProfileFormPage";
import MenuFormPage from "./pages/admin/MenuFormPage";
import Slider from "./pages/admin/SliderListPage";
import SliderForm from "./pages/admin/SliderFormPage";
import CustomPostFormTable from "./pages/admin/CustomPostFormTablePage";
import CustomPostFormPage from "./pages/admin/CustomPostFormPage";
import CustomPostList from "./pages/admin/CustomPostListPage";
import Home from "./pages/user/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/admin/style.css";
import "./assets/css/admin/user/userstyle.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// duplicate imports removed; keep only once
import ContactUs from "./pages/user/ContactUs"; // optional; kept in case you need it elsewhere
import Register from "./pages/user/Register";
import Acts from "./pages/user/Acts";

// Dynamic page
import DynamicPage from "./pages/DynamicPage";

const Mycontext = createContext();

// Private route guard
const PrivateRoute = ({ children }) =>
  checkAuthToken() ? children : <Navigate to="/login" replace />;

// Public route guard
const PublicRoute = ({ children }) =>
  !checkAuthToken() ? children : <Navigate to="/admin/dashboard" replace />;

// Check if token exists for auth status
const checkAuthToken = () => localStorage.getItem("token") !== null;

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Fetch user if logged in and user data is missing
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated, user]);

  const values = { user, isAuthenticated }; // Example context values

  return (
    <Mycontext.Provider value={values}>
      <BrowserRouter>
        <Routes>
          {/* Public home as default */}
          <Route path="/" element={<Home />} />

          {/* Dynamic pages (single page rendering different slugs) */}
          <Route path="/page/:slug" element={<DynamicPage />} />
          <Route path="/page" element={<DynamicPage />} />

          {/* Redirect old contact paths to the new dynamic contact page */}
          {/* <Route path="/contact_us" element={<Navigate to="/page/contact" replace />} />
          <Route path="/contact" element={<Navigate to="/page/contact" replace />} /> */}

          {/* Keep legacy ContactUs if you want an explicit route (optional) */}
          {/* <Route path="/contact_us_explicit" element={<ContactUs />} /> */}

          {/* <Route path="/acts" element={<Acts />} /> */}

          
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Public login (only for Admin) */}
          <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />

          {/* Protected admin area (keeps same nested admin routes) */}
          <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="post" element={<Post />} />
            <Route path="postform/:id?" element={<PostForm />} />
            <Route path="post-category" element={<PostCategory />} />
            <Route path="post-category-form/:id?" element={<PostCategoryForm />} />
            <Route path="user-profile" element={<UserProfileFormPage />} />
            <Route path="menu" element={<MenuFormPage />} />
            <Route path="slider" element={<Slider />} />
            <Route path="sliderform/:id?" element={<SliderForm />} />
            <Route path="custom-post-form-table" element={<CustomPostFormTable />} />
            <Route path="custom-post-form/:tableName/:id?" element={<CustomPostFormPage />} />
            <Route path="custom-post-list/:tableName" element={<CustomPostList />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Optional: fallback 404 behavior (customize as needed) */}
          <Route path="*" element={<div style={{ padding: 40 }}>404 — Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </Mycontext.Provider>
  );
}

export default App;
