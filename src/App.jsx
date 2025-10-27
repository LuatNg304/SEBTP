import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/home";
import Oto from "./pages/home/Oto";
import Bike from "./pages/home/Bike";
import Pin from "./pages/home/Pin";
import AllProduct from "./pages/home/AllProduct";
import ForgotPasswordPage from "./pages/forgotPass/ForgotPasswordPage";
import OTPPage from "./pages/forgotPass/Otp";
import ViewProduct from "./pages/viewProduct";
import UserProfile from "./pages/viewProfile";
import UpgradeSeller from "./pages/ViewUpgrade";
import SellerDashboard from "./pages/seller/SellerDashboard";
import VehiclePost from "./pages/seller/VehiclePost";
import BatteryPost from "./pages/seller/BatteryPost";
import SellerLayout from "./pages/seller/SellerLayout";
import Dashboarrd from "./components/dasboard";
import PostReject from "./pages/admin/post/Posted";
import PostAccept from "./pages/admin/post/PostAccept";
import Posted from "./pages/admin/post/Posted";
import PostPanding from "./pages/admin/post/PostPanding";
import ViewWallet from "./pages/ViewWallet";

import PackagePage from "./pages/seller/packket/PackagePage";
import PostView from "./pages/seller/posts/PostView";

import DemoUp from "./utils/demoUp";

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
    path: "seller",
    element: <SellerLayout />, // layout chứa header + sidebar
    children: [
      { index: true, element: <SellerDashboard /> },
      { path: "post/vehicle", element: <VehiclePost /> },
      { path: "post/battery", element: <BatteryPost /> },
      { path: "/seller/posts/view/:id", element: <PostView /> },
      {
        path: "package",
        element: <PackagePage />,
      },
    ],
  },
  {
    path: "admin",
    element: <Dashboarrd />,
    children: [
      {
        index: true,
        element: <PostPanding />,
      },
      {
        path: "post-reject",
        element: <PostReject />,
      },
      {
        path: "posted",
        element: <Posted />,
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
    path: "view-product/:id",
    element: <ViewProduct />,
  },
  {
    path: "user/wallet",
    element: <ViewWallet />,
  },
  {
    path: "view-profile",
    element: <UserProfile />,
  },
  {
    path: "upgrade-seller",
    element: <UpgradeSeller />,
  },
  // {
  //   path:"/user/wallet/",
  //    element: <VNPayCallback />
  // },
  {
    path: "test",
    element: <DemoUp />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
