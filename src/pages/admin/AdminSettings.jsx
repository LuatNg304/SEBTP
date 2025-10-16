import React from "react";
import { Form, Input, Button, message, Card } from "antd";

const AdminSettings = () => {
  const [form] = Form.useForm();

  const handleSaveGeneral = (values) => {
    console.log("General settings:", values);
    message.success("Cập nhật thông tin trang thành công!");
  };

  const handleChangePassword = (values) => {
    console.log("Change password:", values);
    if (values.newPassword !== values.confirmPassword) {
      message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    message.success("Đổi mật khẩu thành công!");
  };

  return (
    <div className="space-y-8">
      <Card title="Thông tin trang" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            siteName: "ECO-SANH Admin",
            email: "admin@example.com",
          }}
          onFinish={handleSaveGeneral}
        >
          <Form.Item
            label="Tên trang"
            name="siteName"
            rules={[{ required: true, message: "Vui lòng nhập tên trang!" }]}
          >
            <Input placeholder="Nhập tên trang" />
          </Form.Item>

          <Form.Item
            label="Email liên hệ"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input placeholder="Nhập email liên hệ" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Đổi mật khẩu admin" bordered={false}>
        <Form layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu cũ" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminSettings;
