"use client";
import React from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import {
  CarIcon,
  BatteryCharging,
  Paperclip,
  BarChart3,
  MessageCircle,
  Gauge,
} from "lucide-react";
import Header from "../../components/header";
import { useSelector } from "react-redux";

const SellerLayout = () => {
  const account = useSelector((state) => state.account);
  if (!account?.user) {
    // Nếu chưa login hoặc logout rồi, redirect về login
    return <Navigate to="/" replace />;
  }

  // Danh sách các mục trong sidebar
  const sidebarItems = [
    { icon: Gauge, path: "/seller", tooltip: "Dashboard" },
    { icon: CarIcon, path: "/seller/post/vehicle", tooltip: "Đăng bán Xe" },
    {
      icon: BatteryCharging,
      path: "/seller/post/battery",
      tooltip: "Đăng bán Pin",
    },
    { icon: Paperclip, path: "/seller/package", tooltip: "Gói đăng tin" },
    { icon: BarChart3, path: "/seller/stats", tooltip: "Thống kê" },
    { icon: MessageCircle, path: "/seller/messages", tooltip: "Tin nhắn" },
  ];

  return (
    // SỬA 1: Bọc toàn bộ trang trong một flex column có chiều cao bằng màn hình
    <div className="h-screen flex flex-col bg-gray-50">
      <Header /> {/* Header sẽ chiếm không gian cần thiết */}
      {/* SỬA 2: Phần body sẽ lấp đầy không gian còn lại và là một flex row */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {/* SỬA 3: Bỏ `sticky` và `h-screen` vì chiều cao được quản lý bởi flex parent */}
        <aside className="hidden md:block w-16 bg-white border-r border-gray-200 py-6 space-y-4 shadow-lg overflow-y-auto">
          {sidebarItems.map(({ icon: Icon, path, tooltip }, i) => (
            <NavLink
              key={i}
              to={path}
              className={({ isActive }) =>
                `flex justify-center p-3 cursor-pointer transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600 border-l-4 border-emerald-500"
                    : // Thêm hiệu ứng bo tròn và margin để đẹp hơn
                      "text-gray-500 hover:bg-gray-100 hover:text-emerald-600"
                }`
              }
              title={tooltip}
            >
              <Icon className="w-6 h-6" />
            </NavLink>
          ))}
        </aside>

        {/* Main Content */}
        {/* SỬA 4: Bỏ div cha không cần thiết */}
        <main
          // SỬA 5: Bỏ `min-h-screen`, thêm `overflow-y-auto` để cuộn nội bộ
          className="flex-1 p-6 sm:p-10 overflow-y-auto bg-cover bg-center"
          style={{ backgroundImage: "url(/background.png)" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
