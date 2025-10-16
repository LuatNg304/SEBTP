import React, { useState } from "react";
import { FiHeart, FiUser, FiMenu } from "react-icons/fi";
import { DownOutlined } from "@ant-design/icons";
import { Drawer, Dropdown } from "antd";
import LoginModal from "../../components/modals/LoginModal";
import RegisterModal from "../../components/modals/RegisterModal";
import SignupBanner from "../../components/body/SignupBanner";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/accountSlice";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const HomePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSignupBanner, setShowSignupBanner] = useState(true);
<<<<<<< HEAD
  const currentUser = useSelector((state) => state.account);
  
  const location = useLocation();
  useEffect(() => {
    if (location.state?.openLogin) {
      setShowLoginModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
=======
  const [openDrawer, setOpenDrawer] = useState(false);
   const [activeItem, setActiveItem] = useState("");
>>>>>>> feature/admin

  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
  };
  
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
<<<<<<< HEAD
  
=======
  // ✅ Menu chính (Drawer)
  const mainMenu = [
    { key: "", label: "Trang chủ" },
    { key: "oto", label: "Ô tô điện" },
    { key: "bike", label: "Xe máy điện" },
    { key: "pin", label: "Pin & phụ kiện" },
    { key: "about", label: "Giới thiệu" },
  ];
  const handleMenuClick = (item) => {
    setActiveItem(item.key);
    setOpenDrawer(false);
    navigate(`/${item.key}`);
  };
  // ✅ Các mục trong dropdown của avatar
>>>>>>> feature/admin
  const userMenu = {
    items: [
      {
        key: "1",
        label: (
          <div
            onClick={() => navigate("/view-profile")}
            className="flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:text-green-600"
          >
            <FiUser className="text-green-600 transition-transform duration-200 hover:scale-110" />
            <span>Thông tin cá nhân</span>
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div
            className="flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:text-green-600"
          >
            <FiMenu className="text-green-600 transition-transform duration-200 hover:scale-110" />
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
            className="flex items-center gap-2 text-red-500 cursor-pointer transition-colors duration-200 hover:text-red-700"
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
        <img
          src="/panner.png"
          alt="Header background"
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        <div className="absolute top-0 left-0 w-full h-full grid grid-rows-3">
          {/* ===== NAVIGATION ===== */}
          <div className="grid grid-cols-3 items-center px-6">
            
            {/* Left: Logo + Menu */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full bg-white shadow transition-all duration-300 hover:shadow-lg hover:scale-110 hover:bg-gray-50 active:scale-95">
                <FiMenu className="h-6 w-6 text-green-700 transition-transform duration-300" />
              </button>

              {/* ✅ Drawer menu */}
              <Drawer
                title={
                  <div className="text-2xl font-bold text-white text-center">
                    Danh mục
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
                  {mainMenu.map((item) => (
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

              <div className="grid grid-cols-3 items-center px-6">
                <NavLink
                  to="/"
                  onClick={() => {
                    setTimeout(() => window.location.reload(), 100);
                  }}
                  className="text-2xl font-extrabold tracking-wide uppercase no-underline transition-all duration-300 hover:scale-105 hover:tracking-wider"
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
              <button className="p-2 rounded-full transition-all duration-300 hover:bg-white/40 hover:scale-110 active:scale-95">
                <FiHeart className="h-6 w-6 text-gray-700 transition-colors duration-300 hover:text-red-500 hover:fill-red-500" />
              </button>

              {account ? (
                <Dropdown
                  menu={userMenu}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <button className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow transition-all duration-300 hover:shadow-lg hover:bg-gray-50 hover:scale-105 active:scale-95">
                    <img
                      src={account?.avatar || "/default-avatar.png"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300 transition-all duration-300 hover:border-green-600"
                    />
                    <span className="font-medium text-gray-700">
                      {account.user.fullName || "Người dùng"}
                    </span>
                  </button>
                </Dropdown>
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

          {/* ===== SLOGAN ===== */}
          <div className="flex items-center justify-center">
            <span className="text-3xl font-bold font-poppins text-white drop-shadow-xl transition-all duration-500 hover:scale-105 hover:drop-shadow-2xl">
              "Sống xanh – Lái xe điện – Bảo vệ môi trường"
            </span>
          </div>

          {/* ===== SEARCH ===== */}
          <div className="flex items-center justify-center px-4 py-6 mt-10">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-2 transition-all duration-300 hover:shadow-2xl">
              <div className="flex w-full rounded-lg overflow-hidden">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Tìm sản phẩm..."
                    className="w-full px-4 py-3 text-gray-600 bg-white text-sm focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Dropdown danh mục */}
                <div className="ml-2">
                  <Dropdown
                    menu={{
                      items,
                      selectable: true,
                      defaultSelectedKeys: ["3"],
                    }}
                  >
                    <button className="flex items-center gap-2 bg-white border border-white px-6 py-3 rounded-lg font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:border-gray-200">
                      <span>Danh mục</span>
                      <DownOutlined className="text-gray-600 transition-transform duration-300 group-hover:rotate-180" />
                    </button>
                  </Dropdown>
                </div>

                {/* Nút tìm kiếm */}
                <div className="ml-2">
                  <button className="bg-green-600 text-white font-medium px-6 py-2 rounded-lg h-full transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:scale-105 active:scale-95">
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== CONTENT ===== */}
      <main className="mx-auto px-4 py-8 max-w-[1200px] w-full mt-8 transition-opacity duration-500">
        {/* Sub Navigation */}
        <nav className="bg-white bg-opacity-90 rounded-lg shadow-sm mb-4 transition-all duration-300 hover:shadow-md">
          <div className="container mx-auto px-4 py-3">
            <ul className="flex space-x-8">
              <li>
                <NavLink
                  to="oto"
                  className={({ isActive }) =>
                    `font-medium px-3 py-1 rounded-md transition-all duration-300 ${
                      isActive
                        ? "text-white bg-green-600 shadow-md scale-105"
                        : "text-green-600 hover:text-green-800 hover:bg-green-50 hover:scale-105"
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
                    `font-medium px-3 py-1 rounded-md transition-all duration-300 ${
                      isActive
                        ? "text-white bg-green-600 shadow-md scale-105"
                        : "text-green-600 hover:text-green-800 hover:bg-green-50 hover:scale-105"
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
                    `font-medium px-3 py-1 rounded-md transition-all duration-300 ${
                      isActive
                        ? "text-white bg-green-600 shadow-md scale-105"
                        : "text-green-600 hover:text-green-800 hover:bg-green-50 hover:scale-105"
                    }`
                  }
                >
                  Pin
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        {/* Outlet render trang con */}
        <div className="bg-white rounded-lg p-6 transition-all duration-500 hover:shadow-xl">
          <Outlet />
        </div>
      </main>

      {/* ===== SIGNUP BANNER ===== */}
      {!account && showSignupBanner && (
        <div className="transition-all duration-500 ease-in-out">
          <SignupBanner
            onSignupClick={() => setShowRegisterModal(true)}
            onClose={() => setShowSignupBanner(false)}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
