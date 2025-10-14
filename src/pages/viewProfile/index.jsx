import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Modal, Form, Input, message, Avatar, Card, Space } from "antd";
import { UserOutlined, EditOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../redux/accountSlice";

const UserProfile = () => {
  const account = useSelector((state) => state.account);
  const currentUser = account?.user;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingField, setEditingField] = useState(null);

  if (!currentUser) return <p>Đang tải thông tin người dùng...</p>;

  const fields = [
    { key: "email", label: "Email", value: currentUser.email, editable: false },
    { key: "fullName", label: "Họ và tên", value: currentUser.fullName, editable: true },
    { key: "phone", label: "Số điện thoại", value: currentUser.phone || "Chưa cập nhật", editable: true },
    { key: "address", label: "Địa chỉ", value: currentUser.address || "Chưa cập nhật", editable: true },
  ];

  const showModal = (field) => {
    setEditingField(field);
    setIsModalVisible(true);
    form.setFieldsValue({ [field.key]: currentUser[field.key] || "" });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedUser = { ...currentUser, ...values };
      dispatch(updateUser(updatedUser));
      message.success("Cập nhật thông tin thành công!");
      setIsModalVisible(false);
      setEditingField(null);
    } catch {
      message.error("Vui lòng kiểm tra lại thông tin!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingField(null);
  };

  const columns = [
    {
      title: "Trường",
      dataIndex: "label",
      key: "label",
      render: text => <b>{text}</b>,
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: text => <span style={{ color: "#555" }}>{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.editable ? (
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => showModal(record)}>
            Chỉnh sửa
          </Button>
        ) : null,
    },
  ];

  return (
    <Card
      style={{
        width: "90%",
        margin: "20px auto",
        borderRadius: 16,
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        padding: "30px",
        backgroundColor: "#fff",
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
        <Avatar size={120} src={currentUser.avatar} icon={<UserOutlined />} />
        <div style={{ marginLeft: 30 }}>
          <h2 style={{ marginBottom: 4 }}>{currentUser.fullName}</h2>
          <p style={{ color: "#888", marginBottom: 0 }}>{currentUser.role}</p>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Button type="default" icon={<HomeOutlined />} onClick={() => navigate("/")} style={{ borderRadius: 8 }}>
            Home
          </Button>
        </div>
      </div>

      <Table
        dataSource={fields}
        columns={columns}
        rowKey="key"
        pagination={false}
        bordered
        style={{ borderRadius: 12, overflow: "hidden" }}
      />

      <Modal
        title={`Chỉnh sửa ${editingField?.label}`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Cập nhật"
        cancelText="Hủy"
        centered
        bodyStyle={{ borderRadius: 12 }}
      >
        <Form form={form} layout="vertical">
          {editingField && (
            <Form.Item
              name={editingField.key}
              label={editingField.label}
              rules={[
                { required: true, message: `Vui lòng nhập ${editingField.label}!` },
                editingField.key === "phone"
                  ? { pattern: /^\d{10,11}$/, message: "Số điện thoại không hợp lệ!" }
                  : {},
              ]}
            >
              <Input />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Card>
  );
};

export default UserProfile;
