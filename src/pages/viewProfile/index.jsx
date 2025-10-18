import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Avatar,
  Upload,
  message,
  Space,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  HomeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Lấy thông tin user
  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me");
      if (res.data?.data) {
        setUser(res.data.data);
      } else {
        toast.error("Không thể tải thông tin người dùng!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải thông tin người dùng!");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Mở modal
  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
    });
  };

  // Gửi cập nhật
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);
      const res = await api.put("/user/me", values);

      if (res.data?.data) {
        setUser(res.data.data);
        toast.success("Cập nhật thông tin thành công!");
        setIsModalVisible(false);
      } else {
        toast.error(" Cập nhật thất bại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Vui lòng kiểm tra lại thông tin!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => setIsModalVisible(false);

  if (!user) {
    return <Card style={{ margin: 20 }}>Đang tải thông tin người dùng...</Card>;
  }

  const data = [
    { key: "1", label: "Email", value: user.email },
    { key: "2", label: "Họ và tên", value: user.fullName },
    { key: "3", label: "Vai trò", value: user.role },
    { key: "4", label: "Số điện thoại", value: user.phone || "Chưa cập nhật" },
    { key: "5", label: "Địa chỉ", value: user.address || "Chưa cập nhật" },
    {
      key: "6",
      label: "Tên cửa hàng",
      value: user.role === "SELLER" ? user.storeName : null,
    },
    {
      key: "7",
      label: "Description",
      value: user.role === "SELLER" ? user.storeDescription : null,
    },
    {
      key: "8",
      label: "Tên cửa hàng",
      value: user.role === "SELLER" ? user.socialMedia : null,
    },
  ].filter((item) => item.value !== null);

  const columns = [
    {
      title: "Thông tin",
      dataIndex: "label",
      key: "label",
      render: (text) => <b>{text}</b>,
      width: "30%",
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: (text) => <span style={{ color: "#555" }}>{text}</span>,
    },
  ];

  // // 📷 Upload avatar (lưu base64 hoặc URL)
  // const handleUpload = (info) => {
  //   const file = info.file.originFileObj;
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     form.setFieldValue("avatar", e.target.result); // gán base64
  //     message.success("Ảnh đã được tải lên!");
  //   };
  //   reader.readAsDataURL(file);
  // };

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
      <Card
        style={{
          width: "90%",
          margin: "20px auto",
          borderRadius: 16,
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          padding: "30px",
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 30,
            justifyContent: "space-between",
          }}
        >
          <Space align="center">
            <Avatar
              size={100}
              src={user.avatar}
              icon={<UserOutlined />}
              style={{ border: "2px solid #eee" }}
            />
            <div style={{ marginLeft: 20 }}>
              <h2 style={{ marginBottom: 4 }}>{user.fullName}</h2>
              <p style={{ color: "#888", marginBottom: 0 }}>{user.role}</p>
            </div>
          </Space>

          <Space>
            <Button
              type="default"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
              style={{ borderRadius: 8 }}
            >
              Quay về Home
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={showModal}
              style={{
                borderRadius: 8,
                background: "#1677ff",
                fontWeight: 500,
              }}
            >
              Cập nhật thông tin
            </Button>
          </Space>
        </div>

        {/* Table */}
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          bordered
          style={{
            borderRadius: 12,
            overflow: "hidden",
          }}
        />

        {/* Modal update */}
        <Modal
          title="Cập nhật thông tin người dùng"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Cập nhật"
          cancelText="Hủy"
          centered
          confirmLoading={loading}
        >
          <Form layout="vertical" form={form}>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[
                { required: true, message: "Vui lòng nhập họ và tên!" },
                { min: 3, message: "Tên phải có ít nhất 3 ký tự!" },
                { max: 50, message: "Tên không được vượt quá 50 ký tự!" },
              ]}
            >
              <Input placeholder="Nhập họ và tên đầy đủ" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^\d{10,11}$/,
                  message: "Số điện thoại phải có 10–11 chữ số!",
                },
              ]}
            >
              <Input placeholder="VD: 0912345678" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ!" },
                { min: 5, message: "Địa chỉ phải có ít nhất 5 ký tự!" },
              ]}
            >
              <Input.TextArea
                rows={2}
                placeholder="Nhập địa chỉ hiện tại của bạn"
              />
            </Form.Item>

            {/* <Form.Item
            name="avatar"
            label="Ảnh đại diện"
            valuePropName="fileList"
          >
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleUpload}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {form.getFieldValue("avatar") && (
              <Avatar
                src={form.getFieldValue("avatar")}
                size={64}
                style={{ marginTop: 10, border: "1px solid #eee" }}
              />
            )}
          </Form.Item> */}
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default UserProfile;
