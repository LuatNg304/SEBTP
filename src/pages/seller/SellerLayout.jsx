"use client";
import React from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import {
  DollarSign,
  Package,
  BarChart3,
  BatteryCharging,
  MessageCircle,
  Gauge,
  CarIcon,
  PoundSterling,
  PackageIcon,
  PackageMinusIcon,
  PackageX,
  Paintbrush,
  PaletteIcon,
  Parentheses,
  Paperclip,
} from "lucide-react";
import Header from "../../components/header";
import { useSelector } from "react-redux";
import Panel from "antd/es/splitter/Panel";

const SellerLayout = () => {
  const account = useSelector((state) => state.account);
  if (!account?.user) {
    // Nếu chưa login hoặc logout rồi, redirect về login
    return <Navigate to="/" replace />;
  }
  return (
    <div>
      <Header />
      <div className="bg-gray-50 min-h-screen flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-16 bg-white border-r border-gray-200 py-6 
        space-y-6 shadow-lg sticky top-0 h-screen overflow-y-auto">
          {[
            { icon: Gauge, path: "/seller", tooltip: "Dashboard" },
            {
              icon: CarIcon,
              path: "/seller/post/vehicle",
              tooltip: "Đăng bán Xe",
            },
            {
              icon: BatteryCharging,
              path: "/seller/post/battery",
              tooltip: "Đăng bán Pin",
            },
            {
              icon: Paperclip,
              path: "/seller/package",
              tooltip: "Gói đăng tin",
            },

            { icon: BarChart3, path: "/seller/stats", tooltip: "Thống kê" },
            {
              icon: MessageCircle,
              path: "/seller/messages",
              tooltip: "Tin nhắn",
            },
          ].map(({ icon: Icon, path, tooltip }, i) => (
            <NavLink
              key={i}
              to={path}
              className={({ isActive }) =>
                `flex justify-center p-3 cursor-pointer transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600 border-l-4 border-emerald-500"
                    : "text-gray-500 hover:bg-gray-100"
                }`
              }
              title={tooltip}
            >
              <Icon className="w-6 h-6" />
            </NavLink>
          ))}
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main
            className="flex-1 p-6 sm:p-10 min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url(/background.png)" }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;
