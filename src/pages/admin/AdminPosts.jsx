import React, { useState, useEffect } from "react";
import { Table, Button, Space, Popconfirm, message } from "antd";

const mockPosts = [
  {
    id: 1,
    title: "Xe điện VinFast VF e34",
    author: "Nguyễn Văn A",
    status: "Đang hiển thị",
    date: "2025-10-01",
  },
  {
    id: 2,
    title: "Xe máy điện Honda",
    author: "Trần Thị B",
    status: "Ẩn",
    date: "2025-10-03",
  },
  {
    id: 3,
    title: "Pin năng lượng mặt trời",
    author: "Lê Văn C",
    status: "Đang hiển thị",
    date: "2025-10-05",
  },
];

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Giả lập fetch từ API
    setPosts(mockPosts);
  }, []);

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
    message.success("Xóa bài đăng thành công!");
  };

  const handleEdit = (id) => {
    message.info(`Chức năng chỉnh sửa bài đăng ${id} (cần triển khai)`);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Người đăng", dataIndex: "author", key: "author" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Ngày đăng", dataIndex: "date", key: "date" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record.id)}>
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa bài đăng này?"
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
      <h2 className="text-2xl font-bold mb-4">Quản lý bài đăng</h2>
      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default AdminPosts;
