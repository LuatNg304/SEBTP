import React, { useState } from "react";
import { FiHeart, FiUser, FiMenu } from "react-icons/fi";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import LoginModal from "../../components/modals/LoginModal";
import RegisterModal from "../../components/modals/RegisterModal";
import SignupBanner from "../../components/body/SignupBanner";

import { Outlet, NavLink } from "react-router-dom";

const HomePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSignupBanner, setShowSignupBanner] = useState(true);

  const items = [
    { key: "1", label: "Item 1" },
    { key: "2", label: "Item 2" },
    { key: "3", label: "Item 3" },
  ];

  const handleOpenLogin = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };
  const handleOpenRegister = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  return (
    <div
      className="overflow-x-hidden"
      style={{
        backgroundImage: "url('background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      {/* Top Bar */}
      <header className="relative w-full h-[200px]">
        <img
          src="/panner.png"
          alt="Header background"
          className="w-full h-full object-cover"
        />

        <div className="absolute top-0 left-0 w-full h-full grid grid-rows-3">
          {/* Nav */}
          <div className="grid grid-cols-3 items-center px-6">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full bg-white shadow">
                <FiMenu className="h-6 w-6 text-green-700" />
              </button>
              <div className="grid grid-cols-3 items-center px-6">
                <NavLink
                  to="."
                  className="text-2xl font-extrabold tracking-wide uppercase no-underline"
                  style={{ color: "#0b5229ff" }}
                >
                  ECO-SANH
                </NavLink>
              </div>
            </div>

            {/* Center: Empty */}
            <div></div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-4">
              <button className="p-2 rounded-full hover:bg-white/40">
                <FiHeart className="h-6 w-6 text-gray-700" />
              </button>
              <button
                className="px-3 py-1 bg-white rounded-full text-sm font-medium hover:bg-gray-100"
                onClick={handleOpenLogin}
              >
                Đăng nhập
              </button>
              <button
                className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
                onClick={handleOpenLogin}
              >
                Đăng tin
              </button>
              <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={handleOpenRegister}
              />
              <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={handleOpenLogin}
              />
              <button className="p-2 rounded-full bg-white shadow">
                <FiUser className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Slogan */}
          <div className="flex items-center justify-center">
            <span className="text-3xl font-bold font-poppins text-white drop-shadow-xl">
              "Sống xanh – Lái xe điện – Bảo vệ môi trường"
            </span>
          </div>

          {/* Search */}
          <div className="flex items-center justify-center px-4 py-6 mt-10">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-2">
              <div className="flex w-full rounded-lg overflow-hidden">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Tìm sản phẩm..."
                    className="w-full px-4 py-3 text-gray-600 bg-white text-sm focus:outline-none"
                  />
                </div>

                {/* Dropdown */}
                <div className="ml-2">
                  <Dropdown
                    menu={{
                      items,
                      selectable: true,
                      defaultSelectedKeys: ["3"],
                    }}
                  >
                    <button className="flex items-center gap-2 bg-white border border-white px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100">
                      <span>Danh mục</span>
                      <DownOutlined className="text-gray-600" />
                    </button>
                  </Dropdown>
                </div>

                {/* Search Button */}
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

      {/* Content */}
      <main className="mx-auto px-4 py-8 max-w-[1200px] w-full mt-8">
        {/* Sub Navigation */}
        <nav className="bg-white bg-opacity-90 rounded-lg shadow-sm mb-4">
          <div className="container mx-auto px-4 py-3">
            <ul className="flex space-x-8">
              <li>
                <NavLink
                  to="oto"
                  className={({ isActive }) =>
                    `font-medium px-3 py-1 rounded-md transition-colors duration-200 ${
                      isActive
                        ? "text-white bg-green-600"
                        : "text-green-600 hover:text-green-800"
                    }`
                  }
                >
                  Oto điện
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="bike"
                  className={({ isActive }) =>
                    `font-medium px-3 py-1 rounded-md transition-colors duration-200 ${
                      isActive
                        ? "text-white bg-green-600"
                        : "text-green-600 hover:text-green-800"
                    }`
                  }
                >
                  Xe máy điện
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="pin"
                  className={({ isActive }) =>
                    `font-medium px-3 py-1 rounded-md transition-colors duration-200 ${
                      isActive
                        ? "text-white bg-green-600"
                        : "text-green-600 hover:text-green-800"
                    }`
                  }
                >
                  Pin
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        {/* Outlet để render các trang con */}
        <div className="bg-white rounded-lg p-6">
          <Outlet />
        </div>
      </main>

      {/* Modal đăng ký */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => setShowLoginModal(true)}
      />

      {/* Banner đăng ký */}
      {showSignupBanner && (
        <SignupBanner
          onSignupClick={() => setShowRegisterModal(true)}
          onClose={() => setShowSignupBanner(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
