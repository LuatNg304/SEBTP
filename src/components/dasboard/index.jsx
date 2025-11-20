import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  LogoutOutlined,
  MoneyCollectTwoTone,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Avatar, Space, Breadcrumb, Typography } from "antd";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"; // ✅ Thêm useLocation
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/accountSlice";
import { LucidePodcast, Podcast, User, User2, UserCheck, UserCogIcon } from "lucide-react";
import { TbTransactionYen } from "react-icons/tb";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, children, to) {
  return {
    key,
    icon,
    children,
    label: to ? <Link to={to}>{label}</Link> : label,
  };
}

const items = [
  getItem("Bài đăng", "sub1", <User />, [
    getItem("Chờ duyệt", "1", null, null, "/admin"),
    getItem("Từ chối", "2", null, null, "/admin/post-reject"),
    getItem("Đã đăng", "3", null, null, "/admin/posted"),
  ]),
  getItem("Khiếu nại", "4", <LucidePodcast />, null, "/admin/complain"),
  getItem("Gói dịch vụ", "sub2", <UserCogIcon />, [
    getItem("Gói người bán", "5", null, null, "/admin/sellerPackage"),
    getItem("Gói ưu tiên", "6", null, null, "/admin/priorityPackage"),
    getItem("Phần trăm đặt cọc", "7", null, null, "/admin/depositPercentage"),
  ]),
  getItem("Giao dịch", "sub3", <TbTransactionYen />, [
    getItem("Lịch sử giao dịch", "8", null, null, "/admin/sellerPackage"),
    getItem("Ký quỷ", "9", null, null, "/admin/escrow"),
    
  ]),
];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Lấy URL hiện tại

  // ✅ Hàm map URL sang menu key
  const getSelectedKey = (pathname) => {
    const pathMap = {
      "/admin": "1",
      "/admin/post-reject": "2",
      "/admin/posted": "3",
      "/admin/complain": "4",
      "/admin/sellerPackage": "5",
      "/admin/priorityPackage": "6",
      "/admin/depositPercentage": "7",
      // "/admin/priorityPackage": "8",
      "/admin/escrow": "9",
      // Thêm các path khác nếu cần
    };
    return pathMap[pathname] || "1";
  };

  // ✅ Hàm lấy openKeys cho submenu
  const getOpenKeys = (pathname) => {
    if (pathname.startsWith("/admin/sellerPackage") || pathname === "/admin/priorityPackage"|| pathname === "/admin/depositPercentage") {
      return ["sub2"]; // Mở submenu "Gói dịch vụ"
    }
    if (pathname.startsWith("/admin")) {
      return ["sub1"]; // Mở submenu "Bài đăng"
    }
    return [];
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: <span onClick={handleLogout} style={{ cursor: "pointer" }}>Đăng xuất</span>,
        },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 32,
            margin: 16,
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Admin
        </div>
        <Menu
          theme="dark"
          selectedKeys={[getSelectedKey(location.pathname)]} // ✅ Thay defaultSelectedKeys
          defaultOpenKeys={getOpenKeys(location.pathname)} // ✅ Tự động mở submenu
          mode="inline"
          items={items}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            boxShadow: "0 2px 8px #f0f1f2",
          }}
        >
          {account?.user ? (
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <Space style={{ cursor: "pointer" }}>
                <Avatar
                  size="small"
                  src={account.user.avatar}
                  icon={!account.user.avatar && <UserOutlined />}
                />
                <Text strong>{account.user.fullName || "User"}</Text>
              </Space>
            </Dropdown>
          ) : null}
        </Header>

        <Content style={{ margin: "16px" }}>
          <Breadcrumb style={{ marginBottom: 16 }} items={[{ title: "Admin" }, { title: "Dashboard" }]} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 1px 4px rgb(0 21 41 / 8%)",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;