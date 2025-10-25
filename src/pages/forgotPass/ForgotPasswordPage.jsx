import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  // State quản lý hiển thị modal
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập OTP và password
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form] = Form.useForm();

  // Xử lý gửi email
  const handleSendOTP = async (values) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", values.email);
      console.log("Gửi OTP đến:", values.email);
      setEmail(values.email);
      toast.success("Mã OTP đã được gửi!");
      setStep(2);
    } catch (error) {
      console.log(error);
      const errMsg =
      error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý reset mật khẩu
  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      // Dữ liệu gửi lên server
      const data = {
        email: email,
        otp: values.otp,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };
      await api.post("/auth/reset-password", data);
      console.log("Dữ liệu reset:", data);

      toast.success("Đặt lại mật khẩu thành công!");
      form.resetFields();
      navigate("/");
    } catch (error) {
      toast.error("Mã OTP không đúng!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm quay về trang chủ
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <>
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
        {/* Bước 1: Nhập Email */}
        {step === 1 && (
          <Modal
            title="Quên mật khẩu"
            open={true}
            footer={null}
            closable={false}
            width={400}
          >
            <p style={{ marginBottom: 20 }}>Nhập email để nhận mã OTP</p>

            <Form form={form} onFinish={handleSendOTP}>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không đúng định dạng!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email của bạn"
                  size="large"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Gửi mã OTP
              </Button>
            </Form>

            <div style={{ marginTop: 15, textAlign: "center" }}>
              <a onClick={handleGoHome}>Quay về trang chủ</a>
            </div>
          </Modal>
        )}

        {/* Bước 2: Nhập OTP và Password mới */}
        {step === 2 && (
          <Modal
            title="Đặt lại mật khẩu"
            open={true}
            footer={null}
            closable={false}
            width={400}
          >
            <p style={{ marginBottom: 20 }}>
              Nhập mã OTP đã gửi đến <strong>{email}</strong>
            </p>

            <Form form={form} onFinish={handleResetPassword}>
              {/* Nhập OTP */}
              <Form.Item
                name="otp"
                rules={[{ required: true, message: "Vui lòng nhập OTP!" }]}
              >
                <Input placeholder="Mã OTP (6 số)" size="large" maxLength={6} />
              </Form.Item>

              {/* Mật khẩu mới */}
              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  { min: 8, message: "Mật khẩu tối thiểu 8 ký tự!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu mới"
                  size="large"
                />
              </Form.Item>

              {/* Xác nhận mật khẩu */}
              <Form.Item
                name="confirmPassword"
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Xác nhận mật khẩu"
                  size="large"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Đặt lại mật khẩu
              </Button>
            </Form>

            <div style={{ marginTop: 15, textAlign: "center" }}>
              <a onClick={() => setStep(1)} style={{ marginRight: 20 }}>
                Gửi lại OTP
              </a>
              <a onClick={handleGoHome}>Quay về trang chủ</a>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ForgotPasswordPage;
