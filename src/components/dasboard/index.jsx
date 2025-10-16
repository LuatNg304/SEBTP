import React, { useState } from "react";
import {
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Avatar, Space, Breadcrumb, Typography } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/accountSlice";

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
  getItem("Post", "sub1", <UserOutlined />, [
    getItem("Pending", "1", null, null, "/admin"),
    getItem("Reject", "2", null, null, "/admin/post-reject"),
    getItem("Accept", "3", null, null, "/admin/post-accept"),
  ]),
];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: <span onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</span>,
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
          defaultSelectedKeys={["1"]}
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

        <Footer style={{ textAlign: "center", background: "#f0f2f5" }}>
          ECO-SANH ©2025
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
