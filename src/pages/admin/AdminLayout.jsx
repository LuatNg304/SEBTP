import React from "react";
import { Layout, Breadcrumb } from "antd";
import AdminHeader from "./AdminHeader";
import { Outlet, useLocation } from "react-router-dom";

const { Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const currentKey = location.pathname.split("/").pop() || "";

  return (
    <Layout className="min-h-screen w-full overflow-hidden">
      <AdminHeader />

      <Layout
        style={{
          background: "#f5f6fa",
          padding: "16px 24px",
          height: "calc(100vh - 200px)", // header cao 200px
          overflow: "auto",
        }}
      >
        <Breadcrumb
          className="mb-4"
          items={[
            { title: "Admin" },
            { title: currentKey.charAt(0).toUpperCase() + currentKey.slice(1) },
          ]}
        />

        <Content
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 8,
            height: "calc(100% - 40px)",
            overflow: "auto",
          }}
        >
          {/* Route con sẽ render tại đây */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
