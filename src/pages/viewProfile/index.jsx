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
  Select,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  HomeOutlined,
  UploadOutlined,
  CameraOutlined,
  ShopOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/accountSlice";
import { uploadFile } from "../../utils/upload";

const { TextArea } = Input;

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
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

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

  const fetchProvinces = async () => {
    try {
      const res = await api.get("/ghn/address/provinces");
      setProvinces(res.data);
      console.log(res.data);
    } catch (err) {
      toast.error("Không thể tải danh sách tỉnh!");
    }
  };

  const handleProvinceChange = async (provinceId) => {
    setSelectedProvince(provinceId);
    setSelectedDistrict(null);
    setDistricts([]);
    setWards([]);
    form.setFieldsValue({ districtId: undefined, wardCode: undefined });

    try {
      const res = await api.get(`/ghn/address/districts/${provinceId}`);
      setDistricts(res.data);
    } catch (err) {
      toast.error("Không thể tải danh sách quận/huyện!");
    }
  };

  const handleDistrictChange = async (districtId) => {
    setSelectedDistrict(districtId);
    setWards([]);
    form.setFieldsValue({ wardCode: undefined });

    try {
      const res = await api.get(`/ghn/address/wards/${districtId}`);
      setWards(res.data);
    } catch (err) {
      toast.error("Không thể tải danh sách phường/xã!");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchProvinces();
  }, []);

  const showModal = async () => {
    setIsModalVisible(true);

    // Set form values
    form.setFieldsValue({
      fullName: user.fullName,
      phone: user.phone,
      streetAddress: user.streetAddress,
      provinceId: user.provinceId,
      districtId: user.districtId,
      wardCode: user.wardCode,
      ...(user.role === "SELLER" && {
        storeName: user.storeName,
        storeDescription: user.storeDescription,
        socialMedia: user.socialMedia,
      }),
    });

    // Load districts nếu đã có provinceId
    if (user.provinceId) {
      setSelectedProvince(user.provinceId);
      try {
        const res = await api.get(`/ghn/address/districts/${user.provinceId}`);
        setDistricts(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    // Load wards nếu đã có districtId
    if (user.districtId) {
      setSelectedDistrict(user.districtId);
      try {
        const res = await api.get(`/ghn/address/wards/${user.districtId}`);
        setWards(res.data);
      } catch (err) {
        console.error(err);
      }
    }
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

        // Reset form và state
        form.resetFields();
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setDistricts([]);
        setWards([]);

        setIsModalVisible(false);
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error(error);
      if (error.errorFields) {
        toast.error("Vui lòng kiểm tra lại thông tin!");
      } else {
        toast.error("Lỗi khi cập nhật!");
      }
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
      const url = await uploadFile(selectedFile);
      const res = await api.patch("/user/avatar", { avatar: url });

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

  const handleCancel = () => {
    form.resetFields();
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setDistricts([]);
    setWards([]);
    setIsModalVisible(false);
  };

  const handleAvatarCancel = () => {
    setIsAvatarModalVisible(false);
    setSelectedFile(null);
    setPreviewUrl(user.avatar);
  };

  if (!user) {
    return <Card style={{ margin: 20 }}>Đang tải thông tin người dùng...</Card>;
  }

  const data = [
    { key: "1", label: "Email", value: user.email },
    { key: "2", label: "Họ và tên", value: user.fullName },
    { key: "3", label: "Vai trò", value: user.role },
    { key: "4", label: "Số điện thoại", value: user.phone || "Chưa cập nhật" },
    {
      key: "5",
      label: "Địa chỉ",
      value: user.address ? user.address : "Chưa cập nhật",
    },
    ...(user.role === "SELLER"
      ? [
          {
            key: "6",
            label: "Tên cửa hàng",
            value: user.storeName || "Chưa cập nhật",
          },
          {
            key: "7",
            label: "Mô tả cửa hàng",
            value: user.storeDescription || "Chưa cập nhật",
          },
          {
            key: "8",
            label: "Mạng xã hội",
            value: user.socialMedia || "Chưa cập nhật",
          },
        ]
      : []),
  ];

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
            {user.role === "SELLER" && (
              <div style={{ marginLeft: 20 }}>
                <p style={{ color: "#888", marginBottom: 0 }}>
                  Bài đăng còn lại: {user.remainingPosts}
                </p>
                <p style={{ color: "#888", marginBottom: 0 }}>
                  Gói bán hàng:{" "}
                  {user.sellerPackageId ? user.sellerPackageId : "Chưa có"}{" "}
                </p>
              </div>
            )}
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
          destroyOnClose
          width={user.role === "SELLER" ? 700 : 600}
        >
          <Form layout="vertical" form={form} autoComplete="off">
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[
                { required: true, message: "Vui lòng nhập họ và tên!" },
                { min: 3, message: "Tên phải có ít nhất 3 ký tự!" },
                { max: 50, message: "Tên không được vượt quá 50 ký tự!" },
              ]}
            >
              <Input placeholder="Nhập họ và tên đầy đủ" autoComplete="off" />
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
              <Input placeholder="VD: 0912345678" autoComplete="off" />
            </Form.Item>

            {/* Conditional fields cho SELLER */}
            {user.role === "SELLER" && (
              <>
                <Form.Item
                  name="storeName"
                  label="Tên cửa hàng"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên cửa hàng!" },
                    {
                      min: 3,
                      message: "Tên cửa hàng phải có ít nhất 3 ký tự!",
                    },
                    {
                      max: 100,
                      message: "Tên cửa hàng không được quá 100 ký tự!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập tên cửa hàng"
                    prefix={<ShopOutlined />}
                    autoComplete="off"
                  />
                </Form.Item>

                <Form.Item
                  name="storeDescription"
                  label="Mô tả cửa hàng"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mô tả cửa hàng!",
                    },
                    { min: 10, message: "Mô tả phải có ít nhất 10 ký tự!" },
                    { max: 500, message: "Mô tả không được quá 500 ký tự!" },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Mô tả về cửa hàng, sản phẩm bạn bán..."
                    showCount
                    maxLength={500}
                    autoComplete="off"
                  />
                </Form.Item>

                <Form.Item
                  name="socialMedia"
                  label="Mạng xã hội"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập liên kết mạng xã hội!",
                    },
                    {
                      type: "url",
                      message:
                        "Vui lòng nhập URL hợp lệ (bắt đầu với http:// hoặc https://)",
                    },
                  ]}
                >
                  <Input
                    placeholder="https://facebook.com/your-page"
                    prefix={<InfoCircleOutlined />}
                    autoComplete="off"
                  />
                </Form.Item>
              </>
            )}

            <Form.Item
              name="streetAddress"
              label="Số nhà, tên đường"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input placeholder="Ví dụ: 123 Nguyễn Trãi" autoComplete="off" />
            </Form.Item>

            <Form.Item
              name="provinceId"
              label="Tỉnh/Thành phố"
              rules={[{ required: true, message: "Vui lòng chọn tỉnh!" }]}
            >
              <Select
                placeholder="Chọn tỉnh/thành phố"
                onChange={handleProvinceChange}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {provinces.map((item) => (
                  <Select.Option key={item.provinceId} value={item.provinceId}>
                    {item.provinceName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="districtId"
              label="Quận/Huyện"
              rules={[{ required: true, message: "Vui lòng chọn quận!" }]}
            >
              <Select
                placeholder="Chọn quận/huyện"
                onChange={handleDistrictChange}
                disabled={!selectedProvince}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {districts.map((item) => (
                  <Select.Option key={item.districtId} value={item.districtId}>
                    {item.districtName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="wardCode"
              label="Phường/Xã"
              rules={[{ required: true, message: "Vui lòng chọn phường!" }]}
            >
              <Select
                placeholder="Chọn phường/xã"
                disabled={!selectedDistrict}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {wards.map((item) => (
                  <Select.Option key={item.wardCode} value={item.wardCode}>
                    {item.wardName}
                  </Select.Option>
                ))}
              </Select>
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
          destroyOnClose
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
