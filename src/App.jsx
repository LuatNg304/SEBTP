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
import Payment from "./pages/payment";
import Orders from "./pages/orders";
import Order from "./pages/seller/Order";
import OrderView from "./pages/seller/posts/OrderVIew";
import Contract from "./pages/seller/posts/Contract";
import SignOtp from "./pages/seller/posts/OtpContrac";
import ContractView from "./pages/seller/posts/ContractView";
import BuyerContract from "./pages/buyerContract";
import DeliveryView from "./pages/seller/posts/DeliveryView";
import OrderDelivery from "./pages/delivery";
import Complain from "./pages/buyerComplain/Complain";
import AdminComplain from "./pages/admin/complain/AdminComplain";
import ComplaintList from "./pages/seller/complaint/Complaints";
import ComplaintDetail from "./pages/seller/complaint/ComplainDetail";

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
      { path: "/seller/order/view/:id", element: <OrderView /> },
      { path: "/seller/order-deliveries/:id", element: <DeliveryView /> },
      { path: "/seller/contract/create/:id", element: <Contract /> },
      { path: "/seller/contract/view/:id", element: <ContractView /> },
      { path: "/seller/contract/sign-otp/:id", element: <SignOtp /> },
      { path: "/seller/complaints", element: <ComplaintList /> },
      { path: "/seller/complaints/:id", element: <ComplaintDetail /> },
      {
        path: "package",
        element: <PackagePage />,
      },
      { path: "/seller/order", element: <Order /> },
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
      {
        path: "complain",
        element: <AdminComplain />,
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
    path: "/payment/:id",
    element: <Payment />,
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
  {
    path: "orders",
    element: <Orders />,
  },
  {
    path: "contract/:id",
    element: <BuyerContract />,
  },
  {
    path: "delivery/:id",
    element: <OrderDelivery />,
  },
  {
    path: "/complain",
    element: <Complain />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
