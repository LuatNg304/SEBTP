import React, { useState, useEffect } from "react";
import { Table, Button, Space, Popconfirm, message, Tag } from "antd";

const mockUsers = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    email: "vana@example.com",
    role: "Người dùng",
    status: "Hoạt động",
    avatar: "/default-avatar.png",
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    email: "thib@example.com",
    role: "Người dùng",
    status: "Bị khóa",
    avatar: "/default-avatar.png",
  },
  {
    id: 3,
    fullName: "Lê Văn C",
    email: "vanc@example.com",
    role: "Admin",
    status: "Hoạt động",
    avatar: "/default-avatar.png",
  },
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Giả lập fetch dữ liệu từ API
    setUsers(mockUsers);
  }, []);

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    message.success("Xóa người dùng thành công!");
  };

  const handleToggleStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Hoạt động" ? "Bị khóa" : "Hoạt động",
            }
          : user
      )
    );
    message.success("Cập nhật trạng thái người dùng!");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <img
          src={avatar}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "Admin" ? "blue" : "green"}>{role}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Hoạt động" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleToggleStatus(record.id)}>
            {record.status === "Hoạt động" ? "Khóa" : "Mở khóa"}
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Hủy"
          >
            <Button type="danger">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default AdminUsers;
