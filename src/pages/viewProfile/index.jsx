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
  Space,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  HomeOutlined,
  UploadOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/accountSlice";
import { uploadFile } from "../../utils/upload";


const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
    });
  };

  const showAvatarModal = () => {
    setIsAvatarModalVisible(true);
    setPreviewUrl(user.avatar);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await api.put("/user/me", values);

      if (res.data?.data) {
        setUser(res.data.data);
        toast.success("Cập nhật thông tin thành công!");
        const response = await api.get("/user/me");
        dispatch(updateUser(response.data.data));
        setIsModalVisible(false);
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Vui lòng kiểm tra lại thông tin!");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (info) => {
    const file = info.file.originFileObj || info.file;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleAvatarOk = async () => {
    if (!selectedFile) {
      toast.warning("Vui lòng chọn ảnh!");
      return;
    }

    try {
      setAvatarLoading(true);
      const url = await uploadFile(selectedFile)
      console.log(url);
      const res = await api.patch("/user/avatar",  url );
      if (res.data?.data) {
        setUser(res.data.data);
        toast.success("Cập nhật ảnh thành công!");
        const response = await api.get("/user/me");
        dispatch(updateUser(response.data.data));
        setIsAvatarModalVisible(false);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật ảnh!");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleCancel = () => setIsModalVisible(false);

  const handleAvatarCancel = () => {
    setIsAvatarModalVisible(false);
    setSelectedFile(null);
  };

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
      label: "Social Media",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 30,
            justifyContent: "space-between",
          }}
        >
          <Space align="center">
            <div style={{ position: "relative" }}>
              <Avatar
                size={100}
                src={user.avatar}
                icon={<UserOutlined />}
                style={{ border: "2px solid #eee" }}
              />
              <Button
                shape="circle"
                icon={<CameraOutlined />}
                onClick={showAvatarModal}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "#1677ff",
                  color: "#fff",
                  border: "2px solid #fff",
                }}
                size="small"
              />
            </div>
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

        {/* Modal cập nhật thông tin */}
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
          </Form>
        </Modal>

        {/* Modal cập nhật avatar */}
        <Modal
          title="Cập nhật ảnh đại diện"
          open={isAvatarModalVisible}
          onOk={handleAvatarOk}
          onCancel={handleAvatarCancel}
          okText="Cập nhật"
          cancelText="Hủy"
          centered
          confirmLoading={avatarLoading}
        >
          <div style={{ textAlign: "center" }}>
            <Avatar
              src={previewUrl}
              size={120}
              icon={<UserOutlined />}
              style={{ marginBottom: 20, border: "2px solid #eee" }}
            />
            <br />
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleFileChange}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} type="primary">
                Chọn ảnh mới
              </Button>
            </Upload>
            
          </div>
        </Modal>
      </Card>
    </div>
  );
};

export default UserProfile;
