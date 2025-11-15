import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Popconfirm,
  Tag,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const SellerPackage = () => {
  const [sellerPackage, setSellerPackage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/configs/seller-packages");
      setSellerPackage(res.data.data);
    } catch (error) {
      toast.error(error?.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mở modal để thêm mới
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Mở modal để chỉnh sửa
  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      description: record.description,
      price: record.price,
      postLimit: record.postLimit,
    });
    setIsModalOpen(true);
  };

  // Xóa package
  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/configs/seller-packages/${id}`);
      toast.success("Xóa thành công");
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data.message);
    }
  };

  // Submit form (thêm hoặc cập nhật)
  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        // Cập nhật
        await api.put(
          `/admin/configs/seller-packages/${editingRecord.id}`,
          values
        );
        toast.success("Cập nhật thành công");
      } else {
        // Thêm mới
        await api.post("/admin/configs/seller-packages", values);
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
          ENTERPRISE: "red",
        };
        return <Tag color={colorMap[type] || "default"}>{type}</Tag>;
      },
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
      title: "Post Limit",
      dataIndex: "postLimit",
      key: "postLimit",
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
        Thêm Package
      </Button>

      <Table
        columns={columns}
        dataSource={sellerPackage}
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
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập description" }]}
          >
            <Input.TextArea rows={3} />
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

          <Form.Item
            label="Post Limit"
            name="postLimit"
            rules={[{ required: true, message: "Vui lòng nhập post limit" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
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

export default SellerPackage;
