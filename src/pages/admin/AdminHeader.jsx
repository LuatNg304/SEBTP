import React, { useState, useEffect } from "react";
import { FiUser, FiMenu, FiHeart } from "react-icons/fi";
import { Dropdown, Drawer } from "antd";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  // Danh mục menu chính
  const adminMenu = [
    { key: "", label: "Tổng quan" },
    { key: "posts", label: "Quản lý bài đăng" },
    { key: "users", label: "Quản lý người dùng" },
    { key: "settings", label: "Cài đặt" },
  ];

  // Đồng bộ activeItem với URL
  useEffect(() => {
    const currentKey = location.pathname.split("/").pop() || "";
    setActiveItem(currentKey);
  }, [location]);

  const handleMenuClick = (item) => {
    setActiveItem(item.key);
    setOpenDrawer(false);
    navigate(`/admin/${item.key}`);
  };

  // Menu avatar admin
  const userMenu = {
    items: [
      {
        key: "1",
        label: (
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FiUser className="text-green-600" />
            <span>Trang người dùng</span>
          </div>
        ),
      },
      { type: "divider" },
      {
        key: "2",
        label: (
          <div
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-red-500 cursor-pointer"
          >
            🚪 <span>Đăng xuất</span>
          </div>
        ),
      },
    ],
  };

  return (
    <header className="relative w-full h-[200px]">
      {/* Ảnh nền banner */}
      <img
        src="/panner.png"
        alt="Header background"
        className="w-full h-full object-cover"
      />

      <div className="absolute top-0 left-0 w-full h-full grid grid-rows-3">
        {/* ===== NAVIGATION ===== */}
        <div className="grid grid-cols-3 items-center px-6">
          {/* Left: Logo + Menu */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
              onClick={() => setOpenDrawer(true)}
            >
              <FiMenu className="h-6 w-6 text-green-700" />
            </button>

            {/* Drawer menu */}
            <Drawer
              title={
                <div className="text-2xl font-bold text-white text-center">
                  Danh mục quản trị
                </div>
              }
              placement="left"
              onClose={() => setOpenDrawer(false)}
              open={openDrawer}
              closable={false}
              width={260}
              headerStyle={{
                background:
                  "linear-gradient(135deg, #16a34a, #22c55e, #86efac)",
                borderBottom: "2px solid #bbf7d0",
              }}
              bodyStyle={{
                background:
                  "linear-gradient(180deg, #22c55e, #16a34a, #15803d)",
                color: "white",
                paddingTop: "20px",
              }}
            >
              <ul className="space-y-3">
                {adminMenu.map((item) => (
                  <li
                    key={item.key}
                    onClick={() => handleMenuClick(item)}
                    className={`cursor-pointer text-lg font-semibold text-center py-3 rounded-xl transition-all duration-200 ${
                      activeItem === item.key
                        ? "bg-white text-green-700 border-2 border-green-400 shadow-md scale-[1.03]"
                        : "text-white hover:border hover:border-green-200 hover:bg-white/10 hover:scale-[1.02]"
                    }`}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </Drawer>

            {/* Logo */}
            <div className="grid grid-cols-3 items-center px-6">
              <NavLink
                to="/admin"
                className="text-2xl font-extrabold tracking-wide uppercase no-underline"
                style={{ color: "#0b5229ff" }}
              >
                ECO-SANH ADMIN
              </NavLink>
            </div>
          </div>

          {/* Center: Empty */}
          <div></div>

          {/* Right: Avatar */}
          <div className="flex items-center justify-end gap-4">
            <button className="p-2 rounded-full hover:bg-white/40">
              <FiHeart className="h-6 w-6 text-gray-700" />
            </button>

            <Dropdown
              menu={userMenu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <button className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100 transition">
                <img
                  src="/default-avatar.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
                <span className="font-medium text-gray-700">Admin</span>
              </button>
            </Dropdown>
          </div>
        </div>

        {/* ===== SLOGAN ===== */}
        <div className="flex items-center justify-center">
          <span className="text-3xl font-bold font-poppins text-white drop-shadow-xl">
            "Quản lý dễ dàng – Hiệu quả vượt trội"
          </span>
        </div>

        {/* ===== SEARCH BAR ===== */}
        <div className="flex items-center justify-center px-4 py-6 mt-10">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-2">
            <div className="flex w-full rounded-lg overflow-hidden">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm dữ liệu quản trị..."
                  className="w-full px-4 py-3 text-gray-600 bg-white text-sm focus:outline-none"
                />
              </div>

              <div className="ml-2">
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg h-full">
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
