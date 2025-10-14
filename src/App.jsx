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
import ViewProduct from "./pages/viewProduct";
import UserProfile from "./pages/viewProfile";

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
  {
    path:"view-profile",
    element: <UserProfile />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
