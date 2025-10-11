import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/home";
import Oto from "./pages/home/Oto";
import Bike from "./pages/home/Bike";
import Pin from "./pages/home/Pin";
import AllProduct from "./pages/home/AllProduct";
import ForgotPasswordPage from "./pages/forgotPass/ForgotPasswordPage";
import OTPPage from "./pages/forgotPass/Otp";
import ResetPasswordPage from "./pages/forgotPass/resetPass";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ViewProduct from "./pages/viewProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />, // layout ngoài
    children: [
      {
        index: true,
        element: <AllProduct />, // trang chủ (mặc định) hiển thị trong layout ngoài
      },
      {
        path: "oto",
        element: <Oto />,
      },
      {
        path: "bike",
        element: <Bike />,
      },
      {
        path: "pin",
        element: <Pin />,
      },
    ],
  },

  // Route admin
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> }, // <= route mặc định
      { path: "posts", element: <AdminPosts /> },
      { path: "users", element: <AdminUsers /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordPage />, // trang quên mật khẩu hiển thị trong layout ngoài
  },
  {
    path: "otp",
    element: <OTPPage />, // trang nhập mã OTP hiển thị trong layout ngoài
  },
  {
    path: "reset-password",
    element: <ResetPasswordPage />,
  },

  {
    path: "view-product/:slug",
    element: <ViewProduct />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
