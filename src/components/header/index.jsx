import React, { useState } from "react";
import { FiHeart, FiUser, FiMenu } from "react-icons/fi";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import LoginModal from "../../components/modals/LoginModal";
import RegisterModal from "../../components/modals/RegisterModal";
import SignupBanner from "../../components/body/SignupBanner";

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/accountSlice";
const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSignupBanner, setShowSignupBanner] = useState(true);

  //  Lấy dữ liệu account từ Redux
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token"); // nếu bạn có token
    dispatch(logout()); // xoá tài khoản trong Redux
  };
  // Dropdown danh mục
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
  // ✅ Các mục trong dropdown của avatar
  const userMenu = {
    items: [
      {
        key: "1",
        label: (
          <div
            //onClick={() => navigate("/profile")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FiUser className="text-green-600" />
            <span>Trang cá nhân</span>
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div
            // onClick={() => navigate("/register-seller")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FiMenu className="text-green-600" />
            <span>Đăng ký Seller</span>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "3",
        label: (
          <div
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 cursor-pointer"
          >
            🚪 <span>Đăng xuất</span>
          </div>
        ),
      },
    ],
  };
  return (
    <div
      className="overflow-x-hidden"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      {/* ===== HEADER ===== */}
      <header className="relative w-full h-[200px]">
        {/* <img
          src="/panner.png"
          alt="Header background"
          className="w-full h-full object-cover"
        /> */}

        <div className="absolute top-0 left-0 w-full h-full grid grid-rows-3">
          {/* ===== NAVIGATION ===== */}
          <div className="grid grid-cols-3 items-center px-6">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full bg-white shadow">
                <FiMenu className="h-6 w-6 text-green-700" />
              </button>
              <div className="grid grid-cols-3 items-center px-6">
                <NavLink
                  to="/"
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

              {/*  Nếu có tài khoản */}
              {account ? (
                <Dropdown
                  menu={userMenu}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <button className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100 transition">
                    <img
                      src={account?.avatar || "/default-avatar.png"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                    <span className="font-medium text-gray-700">
                      {account?.fullName || "Người dùng"}
                    </span>
                  </button>
                </Dropdown>
              ) : (
                <>
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
                </>
              )}

              {/* Modal đăng nhập / đăng ký */}
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
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
