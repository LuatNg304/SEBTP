import React, { useState } from "react";
import { FiHeart, FiUser, FiMenu, FiZap } from "react-icons/fi";
import { Dropdown, Button, Switch } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/accountSlice";
import LoginModal from "../../components/modals/LoginModal";
import RegisterModal from "../../components/modals/RegisterModal";
import { Search, User, Wallet, Wallet2 } from "lucide-react";
import { AiFillWallet } from "react-icons/ai";

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = account?.user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
  };

  const handleGoToPost = () => {
    navigate("/post/vehicle");
  };

  const handleOpenLogin = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const handleOpenRegister = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  // ⚙️ Handle switch Buyer/Seller
  const handleRoleSwitch = (checked) => {
    if (checked) {
      navigate("/seller-management");
    } else {
      navigate("/");
    }
  };

  const userMenu = {
    items: [
      {
        key: "profile",
        label: (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/view-profile")}
          >
            <User className="text-green-700" />
            <span>Trang cá nhân</span>
          </div>
        ),
      },
      {
        key: "wallet",
        label: (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/wallet")}
          >
            <Wallet2 className="text-green-700" />
            <span>Ví</span>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "switch-role",
        label: (
          <div className="flex items-center justify-between w-full gap-3 py-1">
            <span className="text-gray-700 whitespace-nowrap">
              Chế độ Seller
            </span>
            <Switch
              checked={role === "SELLER"}
              onChange={handleRoleSwitch}
              checkedChildren="On"
              unCheckedChildren="Off"
              style={{ minWidth: 44 }} // giúp giữ khoảng cách ổn định
            />
          </div>
        ),
      },

      {
        type: "divider",
      },
      {
        key: "logout",
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
    <header className="bg-white shadow grid grid-cols-6 items-center px-6 py-3">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full bg-white shadow">
          <FiMenu className="h-6 w-6 text-green-700" />
        </button>
        <NavLink
          to="/"
          className="text-2xl font-extrabold tracking-wide uppercase no-underline mx-8"
          style={{ color: "#0b5229ff" }}
        >
          ECO-SANH
        </NavLink>
      </div>

      {/* CENTER: SEARCH */}
      <div className="bg-[#F4F4F4] rounded-full h-12 flex items-center px-4 col-span-4">
        <form className="flex items-center w-full">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 bg-transparent focus:outline-none text-sm text-gray-700 placeholder-gray-500 px-2"
          />
          <button
            type="submit"
            className="bg-[#EBFDE0] text-green-600 rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-green-100 transition"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-end gap-4">
        <button className="p-2 rounded-full hover:bg-white/40">
          <FiHeart className="h-6 w-6 text-gray-700" />
        </button>

        {account?.user ? (
          <div className="flex items-center gap-3">
            <Dropdown
              menu={userMenu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <button className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100 transition">
                <img
                  src={account?.user?.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
                <span className="font-medium text-gray-700">
                  {account?.user?.fullName || "Người dùng"}
                </span>
              </button>
            </Dropdown>

            <button
              className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
              onClick={handleGoToPost}
            >
              Đăng tin
            </button>
          </div>
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

        {/* Modals */}
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
    </header>
  );
};

export default Header;
