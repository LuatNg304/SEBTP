import React, { useState, useEffect } from "react";
import { FiHeart, FiMenu } from "react-icons/fi";
import { ShopOutlined } from "@ant-design/icons";
import { Dropdown, Switch } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/accountSlice";
import LoginModal from "../../components/modals/LoginModal";
import RegisterModal from "../../components/modals/RegisterModal";
import { LogOutIcon, Search, User, Wallet, ShoppingCart } from "lucide-react";
import api from "../../config/axios";
import { toast } from "react-toastify";

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isWallet, setWallet] = useState(false);
  const [loading, setLoading] = useState(false);

  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = account?.user?.role;

  // Fetch wallet data when component mounts or account changes
  useEffect(() => {
    if (account?.user) {
      fetchWalletData();
    }
  }, [account]);

  const fetchWalletData = async () => {
    try {
      const response = await api.get("/user/wallet/exists");
      setWallet(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWalletAction = async () => {
    if (isWallet) {
      navigate("/user/wallet");
    } else {
      try {
        setLoading(true);
        await api.post("/user/wallet");
        setWallet(true);
        toast.success("Đăng ký ví thành công");
      } catch (error) {
        console.error("Error registering wallet:", error);
        toast.error("Lỗi đăng ký ví");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  const handleGoToPost = () => {
    navigate("/seller/post/vehicle");
  };

  const handleOpenLogin = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const handleOpenRegister = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

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
            className="flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:text-green-600"
            onClick={() => navigate("/view-profile")}
          >
            <User className="text-green-700 transition-transform duration-200 hover:scale-110" />
            <span>Thông tin cá nhân</span>
          </div>
        ),
      },
      {
        key: "wallet",
        label: (
          <div
            className="flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:text-green-600"
            onClick={handleWalletAction}
          >
            <Wallet className="text-green-700 transition-transform duration-200 hover:scale-110" />
            <span>{isWallet ? "Ví" : "Đăng ký ví"}</span>
          </div>
        ),
      },
      // Shopping cart - only show if not SELLER
      ...(role !== "SELLER"
        ? [
            {
              key: "orders",
              label: (
                <div
                  onClick={() => navigate("/orders")}
                  className="flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:text-green-600"
                >
                  <ShoppingCart className="text-green-700 transition-transform duration-200 hover:scale-110" />
                  <span>Đơn hàng</span>
                </div>
              ),
            },
          ]
        : []),
      // Only show "Register Seller" if user is not already a seller
      ...(role !== "SELLER"
        ? [
            {
              key: "upgrade-seller",
              label: (
                <div
                  onClick={() => navigate("/upgrade-seller")}
                  className="flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:text-green-600"
                >
                  <ShopOutlined className="text-green-600 transition-transform duration-200 hover:scale-110" />
                  <span>Đăng ký Seller</span>
                </div>
              ),
            },
          ]
        : []),
      // {
      //   type: "divider",
      // },
      // // Only show "Register Seller" if user is not already a seller
      // ...(role == "SELLER"
      //   ? [
      //       {
      //   key: "switch-role",
      //   label: (
      //     <div className="flex items-center justify-between w-full gap-3 py-1">
      //       <span className="text-gray-700 whitespace-nowrap">
      //         Chế độ Seller
      //       </span>
      //       <Switch
      //         checked={role === "SELLER"}
      //         onChange={handleRoleSwitch}
      //         checkedChildren="On"
      //         unCheckedChildren="Off"
      //         style={{ minWidth: 44 }}
      //       />
      //     </div>
      //   ),
      // },
      //     ]
      //   : []),

      {
        type: "divider",
      },
      {
        key: "logout",
        label: (
          <div
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 cursor-pointer transition-colors duration-200 hover:text-red-700"
          >
            <LogOutIcon className="text-red-500" />
            <span>Đăng xuất</span>
          </div>
        ),
      },
    ],
  };

  return (
    <header className="bg-white shadow grid grid-cols-6 items-center px-6 py-3">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full bg-white shadow transition-all duration-300 hover:shadow-lg hover:scale-110 hover:bg-gray-50 active:scale-95">
          <FiMenu className="h-6 w-6 text-green-700 transition-transform duration-300" />
        </button>
        <NavLink
          to="/"
          className="text-2xl font-extrabold tracking-wide uppercase no-underline mx-8 transition-all duration-300 hover:scale-105 hover:tracking-wider"
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
        <button className="p-2 rounded-full transition-all duration-300 hover:bg-white/40 hover:scale-110 active:scale-95">
          <FiHeart className="h-6 w-6 text-gray-700 transition-colors duration-300 hover:text-red-500 hover:fill-red-500" />
        </button>

        {account?.user ? (
          <div className="flex items-center gap-3">
            <Dropdown
              menu={userMenu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <button className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow transition-all duration-300 hover:shadow-lg hover:bg-gray-50 hover:scale-105 active:scale-95">
                <img
                  src={account?.user?.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 transition-all duration-300 hover:border-green-600"
                />
                <span className="font-medium text-gray-700">
                  {account?.user?.fullName || "Người dùng"}
                </span>
              </button>
            </Dropdown>

            <button
              className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:scale-105 active:scale-95"
              onClick={handleGoToPost}
            >
              Đăng tin
            </button>
          </div>
        ) : (
          <>
            <button
              className="px-3 py-1 bg-white rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:scale-105 active:scale-95"
              onClick={handleOpenLogin}
            >
              Đăng nhập
            </button>
            <button
              className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:scale-105 active:scale-95"
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
