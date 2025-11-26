import React, { createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./redux/authSlice";
import "./index.css";
//import React from "react";



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

// import '../assets/admin/css/argon-dashboard-tailwind.css?v=1.0.1';
// import '../assets/admin/css/nucleo-icons.css';
// import '../assets/admin/css/nucleo-svg.css';
// import '../assets/admin/css/custom.css';
import "./assets/css/admin/style.css";
import "./assets/css/admin/user/userstyle.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ContactUs from "./pages/user/ContactUs";

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
          <Route path="/contact_us" element={<ContactUs />} />


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
            {/* you can keep an inner default for /admin if desired */}
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

            {/* <Route path="/" element={<Navigate to="/Home" replace />} />
          </Route> */}
          
          {/* Redirect unknown routes */}
          {/* <Route
            path="*"
            element={checkAuthToken() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          /> */}
        </Routes>
      </BrowserRouter>
    </Mycontext.Provider>
  );
}

export default App;