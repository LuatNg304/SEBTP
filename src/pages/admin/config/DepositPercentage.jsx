import React, { useEffect, useState } from "react";
import { Card, Form, InputNumber, Button, Spin, Input, Typography } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const { Title } = Typography;

const DepositPercentage = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/configs/app-configs");
      const depositConfig = res.data.data.find(
        (item) => item.configKey === "DEPOSIT_PERCENTAGE_KEY"
      );
      if (depositConfig) {
        form.setFieldsValue({
          configValue: parseFloat(depositConfig.configValue) * 100,
          description: depositConfig.description,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = {
        configKey: "DEPOSIT_PERCENTAGE_KEY",
        configValue: (values.configValue / 100).toString(),
        description: values.description,
      };
      await api.put("/admin/configs/app-configs", payload);
      toast.success("Cập nhật cấu hình thành công");
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={4}>Cấu hình tỉ lệ đặt cọc</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 600 }}
          preserve={false}
        >
          <Form.Item
            label="Tỉ lệ phần trăm (%)"
            name="configValue"
            validateTrigger="onSubmit"
            rules={[
              { required: true, message: "Vui lòng nhập tỉ lệ phần trăm" },
              {
                validator: (_, value) => {
                  if (value === undefined || value === null || value === "") {
                    return Promise.reject("Vui lòng nhập tỉ lệ phần trăm");
                  }
                  const num = Number(value);
                  if (isNaN(num))
                    return Promise.reject("Nhập sai định dạng số");
                  if (num < 1 || num > 100)
                    return Promise.reject("Chỉ được nhập từ 1 đến 100");
                  if (!/^\d{1,3}(\.\d{1,2})?$/.test(String(value)))
                    return Promise.reject("Chỉ tối đa 2 số sau dấu phẩy");
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập từ 1 đến 100"
              stringMode
              min={1}
              max={100}
              step={0.01}
              controls={true}
              decimalSeparator="."
              formatter={(value) => {
                if (!value) return "";
                // Chuyển dấu phẩy thành chấm khi hiển thị
                return value.toString().replace(",", ".");
              }}
              parser={(value) => {
                if (!value) return "";
                // Chấp nhận cả dấu phẩy và chấm, chuyển phẩy thành chấm
                return value.replace(/,/g, ".").replace(/[^0-9.]/g, "");
              }}
            />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            validateTrigger="onSubmit"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
            >
              Lưu cấu hình
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DepositPercentage;
