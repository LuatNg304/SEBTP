import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const PriorityPackage = () => {
  const [priorityPackage, setPriorityPackage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/configs/priority-packages");
      setPriorityPackage(res.data.data);
    } catch (error) {
      toast.error(error?.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      description: record.description,
      durationDays: record.durationDays,
      price: record.price,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/configs/priority-packages/${id}`);
      toast.success("Xóa thành công");
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        await api.put(`/admin/configs/priority-packages/${editingRecord.id}`, values);
        toast.success("Cập nhật thành công");
      } else {
        await api.post("/admin/configs/priority-packages", values);
        toast.success("Thêm mới thành công");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data.message);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const colorMap = {
          BASIC: "blue",
          PREMIUM: "gold",
          PRO: "purple",
          ENTERPRISE: "red"
        };
        return <Tag color={colorMap[type] || "default"}>{type}</Tag>;
      }
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Duration (Days)",
      dataIndex: "durationDays",
      key: "durationDays",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            // onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        // onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Thêm Priority Package
      </Button>

      <Table
        columns={columns}
        dataSource={priorityPackage}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingRecord ? "Chỉnh sửa Package" : "Thêm Package mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Duration (Days)"
            name="durationDays"
            rules={[
              { required: true, message: "Vui lòng nhập duration days" },
              { type: "number", min: 1, message: "Duration phải >= 1 ngày" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Vui lòng nhập price" },
              { type: "number", min: 0.01, message: "Price phải >= 0.01" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0.01} step={0.01} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRecord ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PriorityPackage;
