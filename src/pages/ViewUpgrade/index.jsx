import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Spin } from "antd";
import { ShopOutlined, InfoCircleOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/accountSlice";

const { TextArea } = Input;

const UpgradeSeller = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true); // Đặt true để tự động mở
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const response = await api.get("/user/me");
      const data = response.data.data;
      setUser(data);

      if (!data.address || !data.phone) {
        toast.error(
          "Bạn phải cập nhật đầy đủ thông tin Số điện thoại và địa chỉ"
        );
        navigate("/view-profile");
      }
      if (data.role === "SELLER") {
        navigate("/seller");
      }
    } catch (error) {
      toast.error("Không thể lấy thông tin người dùng");
      console.error(error);
      navigate(-1); // Quay lại trang trước nếu có lỗi
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    navigate(-1); // Quay lại trang trước khi đóng modal
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await api.post("/buyer/upgrade-to-seller", {
        shopName: values.shopName,
        shopDescription: values.shopDescription,
        socialMedia: values.socialMedia,
        ghnToken: values.ghnToken_1,
        ghnShopId: Number(values.ghnShopId_1),
      });

      const response = await api.get("/user/me");
      const updatedUser = response.data.data;
      dispatch(updateUser(updatedUser));

      toast.success("Nâng cấp tài khoản seller thành công!");
      setIsModalVisible(false);
      form.resetFields();
      navigate("/seller");
    } catch (error) {
      toast.error(error.response?.data?.message || "Nâng cấp thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Modal
        title="Đăng ký trở thành Seller"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose
        maskClosable={false}
      >
        <p style={{ marginBottom: "24px", color: "#666" }}>
          Vui lòng điền thông tin cửa hàng của bạn để hoàn tất đăng ký
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="shopName"
            label="Tên cửa hàng"
            rules={[
              { required: true, message: "Vui lòng nhập tên cửa hàng" },
              { min: 3, message: "Tên cửa hàng phải có ít nhất 3 ký tự" },
              { max: 100, message: "Tên cửa hàng không được quá 100 ký tự" },
            ]}
          >
            <Input
              placeholder="Nhập tên cửa hàng của bạn"
              prefix={<ShopOutlined />}
              autoFocus
            />
          </Form.Item>

          <Form.Item
            name="shopDescription"
            label="Mô tả cửa hàng"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả cửa hàng" },
              { min: 10, message: "Mô tả phải có ít nhất 10 ký tự" },
              { max: 500, message: "Mô tả không được quá 500 ký tự" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Mô tả về cửa hàng, sản phẩm bạn bán..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="socialMedia"
            label="Mạng xã hội"
            rules={[
              { required: true, message: "Vui lòng nhập liên kết mạng xã hội" },
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
            />
          </Form.Item>

          <Form.Item
            name="ghnShopId_1"
            label="GHN Shop ID"
            rules={[
              { required: true, message: "Vui lòng nhập Shop ID!" },
              { pattern: /^\d+$/, message: "Shop ID phải là số!" },
            ]}
          >
            <Input
              placeholder="Nhập Shop ID từ GHN"
              prefix={<ShopOutlined />}
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            name="ghnToken_1"
            label="GHN Token API"
            rules={[{ required: true, message: "Vui lòng nhập GHN Token!" }]}
            extra={
              <span>
                Xem hướng dẫn lấy Shop ID và Shop ID{" "}
                <a
                  href="https://api.ghn.vn/home/docs/detail"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1890ff" }}
                >
                  tại đây
                </a>
              </span>
            }
          >
            <Input.Password
              placeholder="Nhập Token API từ GHN"
              prefix={<InfoCircleOutlined />}
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Đăng ký
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpgradeSeller;
